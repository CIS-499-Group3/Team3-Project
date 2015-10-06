declare class Test {
    private name;
    constructor(name: string);
    getName(): string;
}
declare function myfunc(arg1: string, arg2optional?: number, arg3default?: string): string;
declare var test_inferred: Test;
declare var test_explicit: Test;
