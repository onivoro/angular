type Route = {
    path?: string;
    pathMatch?: 'prefix' | 'full';
    component?: any;
    redirectTo?: string;
    children?: Route[];
}

export type TIconicRoute = Route & {
  icon?: string;
  label?: string;
  targetBlank?: boolean;
  href?: string;
};
