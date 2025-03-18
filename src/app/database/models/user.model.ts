export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        public _tokenExpirationDate: Date,
        public roles: string[] 
    ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }

    hasRole(role: string): boolean {
        return this.roles.includes(role);
    }
}