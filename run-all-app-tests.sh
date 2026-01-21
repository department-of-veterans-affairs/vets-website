#!/bin/bash
# Run unit tests for all applications in parallel and summarize results
# Usage: ./script/run-all-app-tests.sh [--timeout SECONDS] [--jobs N]

set -o pipefail

# Parse arguments
TIMEOUT=600  # Default 10 minute timeout per app
JOBS=4       # Default to 4 parallel jobs

while [[ $# -gt 0 ]]; do
    case $1 in
        --timeout) TIMEOUT="$2"; shift 2 ;;
        --jobs|-j) JOBS="$2"; shift 2 ;;
        *) shift ;;
    esac
done

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RESULTS_DIR="/tmp/test-results-$TIMESTAMP"
RESULTS_FILE="$RESULTS_DIR/results.txt"
SUMMARY_FILE="$RESULTS_DIR/summary.txt"
mkdir -p "$RESULTS_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Starting test run at $(date)"
echo "Results directory: $RESULTS_DIR"
echo "Timeout per app: ${TIMEOUT}s"
echo "Parallel jobs: $JOBS"
echo ""

# Get list of application folders
APP_FOLDERS=$(find src/applications -maxdepth 1 -mindepth 1 -type d -exec basename {} \; | sort)
TOTAL_APPS=$(echo "$APP_FOLDERS" | wc -l | tr -d ' ')

echo "Found $TOTAL_APPS application folders"
echo "========================================"

# Function to test a single app (runs in parallel)
test_app() {
    local APP="$1"
    local TIMEOUT="$2"
    local RESULTS_DIR="$3"
    local APP_RESULT_FILE="$RESULTS_DIR/$APP.result"
    local APP_LOG_FILE="$RESULTS_DIR/$APP.log"
    
    # Check if app has tests
    TEST_COUNT=$(find "src/applications/$APP" -name "*.unit.spec.js" -o -name "*.unit.spec.jsx" 2>/dev/null | wc -l | tr -d ' ')
    
    if [ "$TEST_COUNT" -eq 0 ]; then
        echo "SKIPPED|0|0|no tests" > "$APP_RESULT_FILE"
        echo "[SKIP] $APP - no tests"
        return 0
    fi
    
    echo "[START] $APP ($TEST_COUNT test files)"
    
    # Run tests with timeout
    START_TIME=$(date +%s)
    timeout "$TIMEOUT" yarn test:unit --app-folder "$APP" > "$APP_LOG_FILE" 2>&1
    EXIT_CODE=$?
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    if [ $EXIT_CODE -eq 124 ]; then
        echo "TIMEOUT|$DURATION|$TEST_COUNT|timeout after ${TIMEOUT}s" > "$APP_RESULT_FILE"
        echo "[TIMEOUT] $APP after ${TIMEOUT}s"
    elif [ $EXIT_CODE -eq 0 ]; then
        PASS_COUNT=$(grep -oE '[0-9]+ passing' "$APP_LOG_FILE" | head -1 | grep -oE '[0-9]+' || echo "0")
        echo "PASSED|$DURATION|$PASS_COUNT|$PASS_COUNT passing" > "$APP_RESULT_FILE"
        echo "[PASS] $APP - $PASS_COUNT passing (${DURATION}s)"
    else
        FAIL_COUNT=$(grep -oE '[0-9]+ failing' "$APP_LOG_FILE" | head -1 | grep -oE '[0-9]+' || echo "?")
        PASS_COUNT=$(grep -oE '[0-9]+ passing' "$APP_LOG_FILE" | head -1 | grep -oE '[0-9]+' || echo "0")
        echo "FAILED|$DURATION|$PASS_COUNT|$FAIL_COUNT failing, $PASS_COUNT passing" > "$APP_RESULT_FILE"
        echo "[FAIL] $APP - $FAIL_COUNT failing (${DURATION}s)"
    fi
}

export -f test_app

# Run tests in parallel using xargs
echo "$APP_FOLDERS" | xargs -P "$JOBS" -I {} bash -c 'test_app "$@"' _ {} "$TIMEOUT" "$RESULTS_DIR"

echo ""
echo "All tests completed. Generating summary..."
echo ""

# Collect results
PASSED=0
FAILED=0
SKIPPED=0
TIMEOUT_COUNT=0
PASSED_APPS=""
FAILED_APPS=""
SKIPPED_APPS=""
TIMEOUT_APPS=""

for APP in $APP_FOLDERS; do
    RESULT_FILE="$RESULTS_DIR/$APP.result"
    if [ -f "$RESULT_FILE" ]; then
        IFS='|' read -r STATUS DURATION COUNT INFO < "$RESULT_FILE"
        case "$STATUS" in
            PASSED)
                PASSED=$((PASSED + 1))
                PASSED_APPS="$PASSED_APPS $APP"
                echo -e "${GREEN}PASSED${NC} $APP - $INFO (${DURATION}s)"
                echo "$APP: PASSED - $INFO (${DURATION}s)" >> "$RESULTS_FILE"
                ;;
            FAILED)
                FAILED=$((FAILED + 1))
                FAILED_APPS="$FAILED_APPS $APP"
                echo -e "${RED}FAILED${NC} $APP - $INFO (${DURATION}s)"
                echo "$APP: FAILED - $INFO (${DURATION}s)" >> "$RESULTS_FILE"
                # Append failure details
                if [ -f "$RESULTS_DIR/$APP.log" ]; then
                    echo "" >> "$RESULTS_FILE"
                    echo "--- $APP failure details ---" >> "$RESULTS_FILE"
                    grep -A 10 "AssertionError\|Error:\|failing" "$RESULTS_DIR/$APP.log" | head -30 >> "$RESULTS_FILE"
                    echo "--- end $APP ---" >> "$RESULTS_FILE"
                fi
                ;;
            SKIPPED)
                SKIPPED=$((SKIPPED + 1))
                SKIPPED_APPS="$SKIPPED_APPS $APP"
                echo -e "${YELLOW}SKIPPED${NC} $APP - $INFO"
                echo "$APP: SKIPPED - $INFO" >> "$RESULTS_FILE"
                ;;
            TIMEOUT)
                TIMEOUT_COUNT=$((TIMEOUT_COUNT + 1))
                TIMEOUT_APPS="$TIMEOUT_APPS $APP"
                echo -e "${RED}TIMEOUT${NC} $APP - $INFO"
                echo "$APP: TIMEOUT - $INFO" >> "$RESULTS_FILE"
                ;;
        esac
    fi
done

# Generate summary
echo ""
echo "========================================"
echo "                SUMMARY                 "
echo "========================================"
{
    echo ""
    echo "========================================"
    echo "           TEST RUN SUMMARY            "
    echo "========================================"
    echo "Completed at: $(date)"
    echo ""
    echo "Total applications: $TOTAL_APPS"
    echo "  Passed:   $PASSED"
    echo "  Failed:   $FAILED"
    echo "  Skipped:  $SKIPPED (no tests)"
    echo "  Timeout:  $TIMEOUT_COUNT"
    echo ""
    
    if [ -n "$FAILED_APPS" ]; then
        echo "FAILED APPLICATIONS:"
        for app in $FAILED_APPS; do
            echo "  - $app"
        done
        echo ""
    fi
    
    if [ -n "$TIMEOUT_APPS" ]; then
        echo "TIMED OUT APPLICATIONS:"
        for app in $TIMEOUT_APPS; do
            echo "  - $app"
        done
        echo ""
    fi
    
    echo "Results directory: $RESULTS_DIR"
    echo "Full results: $RESULTS_FILE"
} | tee -a "$SUMMARY_FILE"

echo ""
echo "Summary saved to: $SUMMARY_FILE"
echo "Full results saved to: $RESULTS_FILE"
echo "Individual logs: $RESULTS_DIR/<app>.log"

# Exit with failure if any tests failed
if [ $FAILED -gt 0 ] || [ $TIMEOUT_COUNT -gt 0 ]; then
    exit 1
fi
exit 0
