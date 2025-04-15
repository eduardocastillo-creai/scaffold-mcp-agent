import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import {UtilsUi} from 'shared/ui/Utils.ui.class';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: any;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    componentDidCatch(error: any, errorInfo: any): void {
        console.log(error, errorInfo);
        UtilsUi.showNotificationMessage('error', 'General error', 'A connection error has occurred');
    }

    render() {
        if (this.state.hasError) {
            return <h1><FormattedMessage id={'APP__GENERAL_ERROR_CLIENT'}/></h1>;
        }

        return this.props.children;
    }
}
