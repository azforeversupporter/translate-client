import {
    inject, 
    LogManager
} from 'aurelia-framework';
import {Logger} from 'aurelia-logging';
import {Router} from 'aurelia-router';

const USERS: ApplicationUser[] = [{
    id: "80293ab5-022d-4fb8-ae8c-6a48db35f7eb",
    username: "admin",
    password: "admin",
    email: "admin@translate.com"
}, {
    id: "6fea3f7d-5625-4d80-800f-9950072c27cf",
    username: "maintenance",
    password: "maintenance",
    email: "maintenance@translate.com"
}];

@inject(Router)
export default class User {

    constructor(router: Router) {
        this.router = router;
        this.logger = LogManager.getLogger('services.User');
    }

    /**
     * Checks if the current user has been logged in.
     */
    public get loggedIn(): boolean {

        return this._loggedIn;
    }

    /**
     * Gets the identity of the current user, undefined if not logged in.
     */
    public get identity(): ApplicationUser|undefined {

        return this.loggedIn
            ? JSON.parse(JSON.stringify(this._identity))
            : undefined;
    }

    /**
     * Tries to log in
     * @param username The username
     * @param password The password
     * @returns The user identity if successful
     */
    public login(username: string, password: string): Promise<ApplicationUser> {

        return new Promise<ApplicationUser>((resolve, reject) => {

            const user = USERS.find(u => u.username === username && u.password === password);
            if (user) {

                this._loggedIn = true;
                this._identity = user;
                
                this.logger.info(`Successful login for: "${this.identity.id}"`);
                return resolve(user);
            }

            this.logger.error(`Failed to login. Invalid credentials given`);
            return reject(new Error(`Credentials were invalid, please check your username and password then try again!`));
        });
    }

    /**
     * Logs the user out and redirects to the given endpoint (defaults to: 'login')
     */
    public logout(redirect: string = 'login'): Promise<void> {

        return new Promise<void>((resolve, reject) => {

            const id: string = this.identity.id;

            this._loggedIn = false;
            this._identity = undefined;

            this.logger.info(`Successful logout for: "${id}", redirecting to "${redirect}"`);
            resolve();
            
            //TODO: this.router.navigateToRoute(redirect);
        });
    }
 
    private readonly router: Router;
    private readonly logger: Logger;

    private _loggedIn: boolean = false;
    private _identity: ApplicationUser;
}