export class RedirectService {

    constructor(public baseUrl: string, public loginPath = 'loging', public unauthorizedPath = 'unauthorized') { }

    getLoginRedirectUrl() {
        const { href } = window.location;
        const target = `${this.baseUrl}/${this.loginPath}`;

        if (href.includes(this.baseUrl)) {
            return target;
        }

        return `${target}/${encodeURIComponent(href)}`;
    }

    getForbiddenRedirectUrl() {
        return `${this.baseUrl}/${this.unauthorizedPath}`;
    }
}