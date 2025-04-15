import { useEffect, useMemo, useState } from "react";

type FormValidations<T> = {
    [K in keyof T]?: [(value: T[K]) => boolean, string?];
};

export const useForm = <T>(initialForm: T, formValidations: FormValidations<T> = {}) => {
    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setFormValidation] = useState<Record<string, any>>({});

    useEffect(() => {
        createValidators();
    }, [formState]);

    const isFormValid = useMemo(() => {
        for (const formValue of Object.keys(formValidation)) {
            if (formValidation[formValue] !== null) return false;
        }
        return true;
    }, [formValidation]);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value
        });
    };

    const createValidators = () => {
        const formCheckedValues: Record<string, any> = {};

        for (const formField of Object.keys(formValidations) as Array<keyof T>) {
            const [fn, errorMessage = 'Campo invalido'] = formValidations[formField]!;
            formCheckedValues[`${String(formField)}Valid`] = fn(formState[formField]) ? null : errorMessage;
        }

        setFormValidation(formCheckedValues);
    };

    return {
        formState,
        onInputChange,
        formValidation,
        isFormValid
    };
};
