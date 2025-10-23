// Type declarations for platform user modules

declare module '@department-of-veterans-affairs/platform-user/selectors' {
  export function selectUser(state: any): any;
}

declare module '@department-of-veterans-affairs/platform-user/profile/backendServices' {
  const backendServices: {
    USER_PROFILE: string;
    [key: string]: string;
  };
  export default backendServices;
}

declare module '@department-of-veterans-affairs/platform-user/RequiredLoginView' {
  interface RequiredLoginViewProps {
    user: any;
    serviceRequired: string[];
    children: React.ReactNode;
  }

  export const RequiredLoginView: React.FC<RequiredLoginViewProps>;
}
