interface AlertUnregisteredProps {
  headline: string;
  recordEvent: ({}) => void;
  ssoe: boolean;
  testId: string;
}

declare const AlertUnregistered: React.FC<AlertUnregisteredProps>;
