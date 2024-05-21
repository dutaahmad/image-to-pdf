import { OBJECT_LOCKER_SECRET_KEY } from "@/env";
import { IOBJECT_LOCKER_SECRET_KEY, InitialPropertiesMyObjectType } from "@/lib/types";

export class MyObject<PropertiesType extends InitialPropertiesMyObjectType> extends Object {
    private _lockKey: string | null = null;

    constructor(
        initialProperties: InitialPropertiesMyObjectType,
        lockNow?: ({ instance, secretkey }: { instance: MyObject<PropertiesType>, secretkey: IOBJECT_LOCKER_SECRET_KEY }) => void,
        secretKey?: IOBJECT_LOCKER_SECRET_KEY
    ) {
        super();

        // Check for forbidden property names
        const forbiddenProperties = ['isLocked', 'lock', 'unlock'];
        for (const prop of forbiddenProperties) {
            if (prop in initialProperties) {
                throw new Error(`The property name "${prop}" is reserved and cannot be used as an initial property.`);
            }
        };
        Object.assign(this, initialProperties);
        if (lockNow && secretKey) {
            lockNow({
                instance: this,
                secretkey: secretKey,
            });
        }
    }

    isLocked(): boolean {
        return Object.isFrozen(this);
    }
    // isLocked = Object.isFrozen(this);

    lock(secretKey: IOBJECT_LOCKER_SECRET_KEY): void {
        const envSecretKey = OBJECT_LOCKER_SECRET_KEY;

        if (envSecretKey === undefined) {
            throw new Error("Environment secret key is not defined.");
        }

        if (secretKey !== envSecretKey) {
            throw new Error("Invalid secret key.");
        }

        // this._lockKey = secretKey;
        // Object.preventExtensions(this); // Prevent new properties from being added
        // Object.freeze(this); // Locks the object, making it immutable

        if (!this.isLocked()) {
            this._lockKey = secretKey;
            Object.preventExtensions(this); // Prevent new properties from being added
            Object.freeze(this); // Locks the object, making it immutable
        }
        else {
            console.error("Object is already locked.");
        }
    }

    unlock(secretKey: string): void {
        if (this.isLocked() && this._lockKey === secretKey) {
            // Unfortunately, there is no way to unfreeze an object in JavaScript,
            // so the unlock method can't fully unlock a frozen object.
            // This is a limitation due to JavaScript's Object.freeze.
            throw new Error("Once an object is locked (frozen), it cannot be unlocked in JavaScript.");
        } else {
            throw new Error("Incorrect secret key or object is not locked.");
        }
    }
}

export default class LockedObject<PropertiesType extends InitialPropertiesMyObjectType> extends MyObject<PropertiesType> {
    constructor(properties: PropertiesType, secretKey: IOBJECT_LOCKER_SECRET_KEY) {
        super(properties);
        this.lock(secretKey);
    }
}