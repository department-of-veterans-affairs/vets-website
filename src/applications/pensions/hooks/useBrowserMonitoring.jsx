import { useEffect } from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { datadogLogs } from '@datadog/browser-logs';

import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import { isProductionEnv } from '../helpers';

// CONSTANTS
const APP_UUID = 'b3319250-eeb3-419c-b596-3422aec52e4d';
const APP_DASHBOARD_NAME = 'benefits-pension';
const TOKEN_ID = 'pubd03b9c29b16b25a9fa3ba5cbe8670658';
const VERSION = '1.0.0';

// https://docs.datadoghq.com/real_user_monitoring/guide/identify-bots-in-the-ui/#filter-out-bot-sessions-on-intake
const botPattern =
  '(googlebot/|bot|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)';
const botRegex = new RegExp(botPattern, 'i');
const conditionalSampleRate = botRegex.test(navigator.userAgent) ? 0 : 100;

const initializeRealUserMonitoring = () => {
  // Prevent RUM from re-initializing the SDK OR running on local/CI environments.
  if (isProductionEnv()) {
    datadogRum.init({
      // https://docs.datadoghq.com/real_user_monitoring/browser/#configuration
      // custom settings
      applicationId: `${APP_UUID}`,
      clientToken: `${TOKEN_ID}`,
      service: `${APP_DASHBOARD_NAME}`,
      version: `${VERSION}`,

      // default settings
      site: 'ddog-gov.com',
      env: environment.vspEnvironment(),
      sessionSampleRate: conditionalSampleRate,
      sessionReplaySampleRate: 20,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: 'mask-user-input',
    });

    // If sessionReplaySampleRate > 0, we need to manually start the recording
    datadogRum.startSessionReplayRecording();
  }
};

const initializeBrowserLogging = () => {
  if (isProductionEnv()) {
    datadogLogs.init({
      // https://docs.datadoghq.com/logs/log_collection/javascript/?tab=us#configuration
      // custom settings
      applicationId: `${APP_UUID}`,
      clientToken: `${TOKEN_ID}`,
      service: `${APP_DASHBOARD_NAME}`,
      version: `${VERSION}`,

      // default settings
      site: 'ddog-gov.com',
      env: environment.vspEnvironment(),
      sessionSampleRate: conditionalSampleRate,
      forwardErrorsToLogs: true,
      forwardConsoleLogs: ['error'],
      forwardReports: [],
      telemetrySampleRate: 100,
    });
  }
};

const useBrowserMonitoring = () => {
  // Retrieve feature flag values to control behavior
  const {
    TOGGLE_NAMES,
    useToggleValue,
    useToggleLoadingValue,
  } = useFeatureToggle();

  const isLoadingFeatureFlags = useToggleLoadingValue();
  const isBrowserMonitoringEnabled = useToggleValue(
    TOGGLE_NAMES.pensionsBrowserMonitoringEnabled,
  );

  useEffect(
    () => {
      if (isLoadingFeatureFlags) return;
      if (isBrowserMonitoringEnabled) {
        initializeRealUserMonitoring();
        initializeBrowserLogging();
      } else {
        delete window.DD_RUM;
      }
    },
    [isBrowserMonitoringEnabled, isLoadingFeatureFlags],
  );
};

export { useBrowserMonitoring };
