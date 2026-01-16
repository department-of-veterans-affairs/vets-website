#!/bin/bash
# shellcheck shell=bash
#
# Run unit tests for all applications in parallel and summarize results
#
# This script discovers all application folders under src/applications,
# runs their unit tests in parallel, and generates a comprehensive summary
# of results including pass/fail counts, timeouts, and failure details.
#
# Usage: ./script/run-all-app-tests.sh [OPTIONS]
#
# Options:
#   --timeout SECONDS  Timeout per application (default: 600)
#   --jobs, -j N       Number of parallel jobs (default: 4)
#   --cleanup-days N   Remove result dirs older than N days (default: 7, 0 to disable)
#   --help, -h         Show this help message
#
# Examples:
#   ./script/run-all-app-tests.sh
#   ./script/run-all-app-tests.sh --timeout 300 --jobs 8
#   ./script/run-all-app-tests.sh -j 2 --cleanup-days 3
#
# Exit codes:
#   0 - All tests passed
#   1 - One or more tests failed or timed out
#   2 - Script error (wrong directory, invalid arguments, etc.)

set -e -o pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Default configuration
TIMEOUT=600        # Default 10 minute timeout per app
JOBS=4             # Default to 4 parallel jobs
CLEANUP_DAYS=7     # Default cleanup of results older than 7 days

# Show help message
show_help() {
    cat << 'EOF'
Run unit tests for all applications in parallel and summarize results

This script discovers all application folders under src/applications,
runs their unit tests in parallel, and generates a comprehensive summary
of results including pass/fail counts, timeouts, and failure details.

Usage: ./script/run-all-app-tests.sh [OPTIONS]

Options:
  --timeout SECONDS  Timeout per application (default: 600)
  --jobs, -j N       Number of parallel jobs (default: 4)
  --cleanup-days N   Remove result dirs older than N days (default: 7, 0 to disable)
  --help, -h         Show this help message

Examples:
  ./script/run-all-app-tests.sh
  ./script/run-all-app-tests.sh --timeout 300 --jobs 8
  ./script/run-all-app-tests.sh -j 2 --cleanup-days 3

Exit codes:
  0 - All tests passed
  1 - One or more tests failed or timed out
  2 - Script error (wrong directory, invalid arguments, etc.)
EOF
    exit 0
}

# Validate numeric argument
validate_number() {
    local name="$1"
    local value="$2"
    if ! [[ "$value" =~ ^[0-9]+$ ]]; then
        echo -e "${RED}Error:${NC} --$name requires a numeric value, got '$value'" >&2
        exit 2
    fi
}

# Validate that an argument value is provided
validate_arg_value() {
    local flag="$1"
    local value="$2"
    if [[ -z "$value" || "$value" == -* ]]; then
        echo -e "${RED}Error:${NC} $flag requires a value" >&2
        exit 2
    fi
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --timeout)
            validate_arg_value "--timeout" "$2"
            validate_number "timeout" "$2"
            TIMEOUT="$2"
            shift 2
            ;;
        --jobs|-j)
            validate_arg_value "--jobs" "$2"
            validate_number "jobs" "$2"
            JOBS="$2"
            shift 2
            ;;
        --cleanup-days)
            validate_arg_value "--cleanup-days" "$2"
            validate_number "cleanup-days" "$2"
            CLEANUP_DAYS="$2"
            shift 2
            ;;
        --help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}Error:${NC} Unknown option '$1'. Use --help for usage." >&2
            exit 2
            ;;
    esac
done

# Validate we're running from the repository root
if [[ ! -d "src/applications" ]]; then
    echo -e "${RED}Error:${NC} Must run from the vets-website repository root." >&2
    echo "Expected to find: src/applications/" >&2
    exit 2
fi

# Validate required commands are available
if ! command -v timeout &>/dev/null; then
    echo -e "${RED}Error:${NC} Required command 'timeout' is not available." >&2
    echo "On macOS, install coreutils: brew install coreutils" >&2
    exit 2
fi

if ! command -v flock &>/dev/null; then
    echo -e "${RED}Error:${NC} Required command 'flock' is not available." >&2
    echo "On macOS, install flock: brew install flock" >&2
    exit 2
fi

# Cleanup old result directories
if [[ "$CLEANUP_DAYS" -gt 0 ]]; then
    old_dirs=$(find /tmp -maxdepth 1 -name "test-results-*" -type d -mtime +"$CLEANUP_DAYS" 2>/dev/null | wc -l | tr -d ' ')
    if [[ "$old_dirs" -gt 0 ]]; then
        echo -e "${BLUE}Cleaning up${NC} $old_dirs old result directories (older than $CLEANUP_DAYS days)..."
        # Use -print0 and xargs for safe handling of directory names
        find /tmp -maxdepth 1 -name "test-results-*" -type d -mtime +"$CLEANUP_DAYS" -print0 2>/dev/null | xargs -0 rm -rf 2>/dev/null || true
    fi
fi

# Setup results directory
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
RESULTS_DIR="/tmp/test-results-$TIMESTAMP"
RESULTS_FILE="$RESULTS_DIR/results.txt"
SUMMARY_FILE="$RESULTS_DIR/summary.txt"
PROGRESS_FILE="$RESULTS_DIR/.progress"
if ! mkdir -p "$RESULTS_DIR"; then
    echo -e "${RED}Error:${NC} Failed to create results directory at '$RESULTS_DIR'." >&2
    exit 2
fi

echo "Starting test run at $(date)"
echo "Results directory: $RESULTS_DIR"
echo "Timeout per app: ${TIMEOUT}s"
echo "Parallel jobs: $JOBS"
echo ""

# Get list of application folders using array for safety
# Using while loop instead of mapfile for bash 3.x compatibility (macOS default)
APP_FOLDERS=()
while IFS= read -r folder; do
    APP_FOLDERS+=("$folder")
done < <(find src/applications -maxdepth 1 -mindepth 1 -type d -exec basename {} \; | sort)
TOTAL_APPS=${#APP_FOLDERS[@]}

if [[ "$TOTAL_APPS" -eq 0 ]]; then
    echo -e "${RED}Error:${NC} No application folders found in src/applications/" >&2
    exit 2
fi

# Initialize progress counter
echo "0" > "$PROGRESS_FILE"

echo "Found $TOTAL_APPS application folders"
echo "========================================"

# Function to test a single app (runs in parallel)
# Writes results to individual files to avoid race conditions
test_app() {
    local APP="$1"
    local TIMEOUT="$2"
    local RESULTS_DIR="$3"
    local TOTAL_APPS="$4"
    local APP_RESULT_FILE="$RESULTS_DIR/$APP.result"
    local APP_LOG_FILE="$RESULTS_DIR/$APP.log"
    local PROGRESS_FILE="$RESULTS_DIR/.progress"
    
    # Check if app has tests
    local TEST_COUNT
    TEST_COUNT=$(find "src/applications/$APP" \( -name "*.unit.spec.js" -o -name "*.unit.spec.jsx" \) 2>/dev/null | wc -l | tr -d ' ')
    
    # Update and display progress (using flock for thread safety)
    # Note: This nested function is intentional - it captures variables from test_app's scope
    # and is available in the subshell because test_app is exported via export -f
    update_progress() {
        local status="$1"
        local current
        {
            flock -x 200
            current=$(cat "$PROGRESS_FILE")
            current=$((current + 1))
            echo "$current" > "$PROGRESS_FILE"
            echo "[$current/$TOTAL_APPS] $status"
        } 200>"$PROGRESS_FILE.lock"
    }
    
    if [[ "$TEST_COUNT" -eq 0 ]]; then
        echo "SKIPPED|0|0|no tests" > "$APP_RESULT_FILE"
        update_progress "[SKIP] $APP - no tests"
        return 0
    fi
    
    # Log start to file (avoid stdout race conditions during parallel execution)
    echo "[START] $APP ($TEST_COUNT test files)" >> "$RESULTS_DIR/.starts.log"
    
    # Run tests with timeout
    local START_TIME END_TIME DURATION EXIT_CODE
    START_TIME=$(date +%s)
    timeout "$TIMEOUT" yarn test:unit --app-folder "$APP" > "$APP_LOG_FILE" 2>&1
    EXIT_CODE=$?
    END_TIME=$(date +%s)
    DURATION=$((END_TIME - START_TIME))
    
    # Parse results - handle potential variations in mocha output
    local PASS_COUNT FAIL_COUNT
    PASS_COUNT=$(grep -oE '[0-9]+ passing' "$APP_LOG_FILE" 2>/dev/null | head -1 | grep -oE '[0-9]+' || echo "0")
    FAIL_COUNT=$(grep -oE '[0-9]+ failing' "$APP_LOG_FILE" 2>/dev/null | head -1 | grep -oE '[0-9]+' || echo "0")
    
    if [[ $EXIT_CODE -eq 124 ]]; then
        echo "TIMEOUT|$DURATION|$TEST_COUNT|timeout after ${TIMEOUT}s" > "$APP_RESULT_FILE"
        update_progress "[TIMEOUT] $APP after ${TIMEOUT}s"
    elif [[ $EXIT_CODE -eq 0 ]]; then
        echo "PASSED|$DURATION|$PASS_COUNT|$PASS_COUNT passing" > "$APP_RESULT_FILE"
        update_progress "[PASS] $APP - $PASS_COUNT passing (${DURATION}s)"
    else
        # Distinguish between test failures and execution errors (e.g., missing dependencies)
        if [[ "$PASS_COUNT" -eq 0 && "$FAIL_COUNT" -eq 0 ]]; then
            echo "ERROR|$DURATION|0|test command failed (exit code $EXIT_CODE); see log for details" > "$APP_RESULT_FILE"
            update_progress "[ERROR] $APP - test command failed (exit code $EXIT_CODE) (${DURATION}s)"
        else
            echo "FAILED|$DURATION|$PASS_COUNT|$FAIL_COUNT failing, $PASS_COUNT passing" > "$APP_RESULT_FILE"
            update_progress "[FAIL] $APP - $FAIL_COUNT failing (${DURATION}s)"
        fi
    fi
}

export -f test_app

# Run tests in parallel using xargs
printf '%s\n' "${APP_FOLDERS[@]}" | xargs -P "$JOBS" -I {} bash -c 'test_app "$@"' _ {} "$TIMEOUT" "$RESULTS_DIR" "$TOTAL_APPS"

echo ""
echo "All tests completed. Generating summary..."
echo ""

# Collect results using arrays for proper handling
PASSED=0
FAILED=0
SKIPPED=0
TIMEOUT_COUNT=0
ERROR_COUNT=0
declare -a PASSED_APPS=()
declare -a FAILED_APPS=()
declare -a SKIPPED_APPS=()
declare -a TIMEOUT_APPS=()
declare -a ERROR_APPS=()

for APP in "${APP_FOLDERS[@]}"; do
    RESULT_FILE="$RESULTS_DIR/$APP.result"
    if [[ -f "$RESULT_FILE" ]]; then
        IFS='|' read -r STATUS DURATION COUNT INFO < "$RESULT_FILE"
        case "$STATUS" in
            PASSED)
                PASSED=$((PASSED + 1))
                PASSED_APPS+=("$APP")
                echo -e "${GREEN}PASSED${NC} $APP - $INFO (${DURATION}s)"
                echo "$APP: PASSED - $INFO (${DURATION}s)" >> "$RESULTS_FILE"
                ;;
            FAILED)
                FAILED=$((FAILED + 1))
                FAILED_APPS+=("$APP")
                echo -e "${RED}FAILED${NC} $APP - $INFO (${DURATION}s)"
                echo "$APP: FAILED - $INFO (${DURATION}s)" >> "$RESULTS_FILE"
                # Append failure details
                if [[ -f "$RESULTS_DIR/$APP.log" ]]; then
                    {
                        echo ""
                        echo "--- $APP failure details ---"
                        grep -E -A 10 'AssertionError|Error:|failing' "$RESULTS_DIR/$APP.log" | head -30
                        echo "--- end $APP ---"
                    } >> "$RESULTS_FILE"
                fi
                ;;
            SKIPPED)
                SKIPPED=$((SKIPPED + 1))
                SKIPPED_APPS+=("$APP")
                echo -e "${YELLOW}SKIPPED${NC} $APP - $INFO"
                echo "$APP: SKIPPED - $INFO" >> "$RESULTS_FILE"
                ;;
            TIMEOUT)
                TIMEOUT_COUNT=$((TIMEOUT_COUNT + 1))
                TIMEOUT_APPS+=("$APP")
                echo -e "${RED}TIMEOUT${NC} $APP - $INFO"
                echo "$APP: TIMEOUT - $INFO" >> "$RESULTS_FILE"
                ;;
            ERROR)
                ERROR_COUNT=$((ERROR_COUNT + 1))
                ERROR_APPS+=("$APP")
                echo -e "${RED}ERROR${NC} $APP - $INFO (${DURATION}s)"
                echo "$APP: ERROR - $INFO (${DURATION}s)" >> "$RESULTS_FILE"
                # Append error details from log
                if [[ -f "$RESULTS_DIR/$APP.log" ]]; then
                    {
                        echo ""
                        echo "--- $APP error details ---"
                        tail -50 "$RESULTS_DIR/$APP.log"
                        echo "--- end $APP ---"
                    } >> "$RESULTS_FILE"
                fi
                ;;
        esac
    else
        echo -e "${YELLOW}WARNING${NC} No result file for $APP"
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
    echo "  Errors:   $ERROR_COUNT (execution errors)"
    echo "  Skipped:  $SKIPPED (no tests)"
    echo "  Timeout:  $TIMEOUT_COUNT"
    echo ""
    
    if [[ ${#FAILED_APPS[@]} -gt 0 ]]; then
        echo "FAILED APPLICATIONS:"
        for app in "${FAILED_APPS[@]}"; do
            echo "  - $app"
        done
        echo ""
    fi
    
    if [[ ${#ERROR_APPS[@]} -gt 0 ]]; then
        echo "ERROR APPLICATIONS (execution errors):"
        for app in "${ERROR_APPS[@]}"; do
            echo "  - $app"
        done
        echo ""
    fi
    
    if [[ ${#TIMEOUT_APPS[@]} -gt 0 ]]; then
        echo "TIMED OUT APPLICATIONS:"
        for app in "${TIMEOUT_APPS[@]}"; do
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

# Cleanup temporary files
rm -f "$PROGRESS_FILE" "$PROGRESS_FILE.lock" "$RESULTS_DIR/.starts.log"

# Exit with failure if any tests failed, errored, or timed out
if [[ $FAILED -gt 0 ]] || [[ $TIMEOUT_COUNT -gt 0 ]] || [[ $ERROR_COUNT -gt 0 ]]; then
    exit 1
fi
exit 0


