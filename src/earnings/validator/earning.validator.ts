import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { EarningCalenderQuery } from "types/earnings";

export function IsNotBeforeThisMonth(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) =>
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate: (value: any, args: ValidationArguments) => {
                    if (!value) return false;
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return false; // invalid date

                    const now = new Date();
                    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

                    return date >= firstDayOfMonth;
                },

                defaultMessage: (args: ValidationArguments) => {
                    return `${args.property} must be greater than or equal to the first day of this month`;
                },
            },
        })

}

@ValidatorConstraint({ name: 'isGreaterThanEqualFrom', async: false })
class IsGreaterThanEqualFromConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const argObject = args.object as EarningCalenderQuery
        if (!argObject.from || !value) return false;
        const fromDate = new Date(argObject.from)
        const toDate = new Date(value)

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return false; // invalid dates

        return toDate >= fromDate;
    }

    defaultMessage(args?: ValidationArguments): string {
        return `${args?.property} must be greater than ${args?.constraints[0]}`
    }
}

export function IsGreaterThanEqualFrom(props: string[], validationOptions?: ValidationOptions) {
    return function (obj: Object, propertyName: string) {
        registerDecorator({
            target: obj.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: props,
            validator: IsGreaterThanEqualFromConstraint,
        })
    }
}