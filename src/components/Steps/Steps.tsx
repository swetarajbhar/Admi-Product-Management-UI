import cx from 'classnames';
import { Fragment } from 'react';
import styles from './Steps.module.scss';

export interface IStep {
    displayValue: string,
    name: string,
}

interface ISteps {
    steps: Array<IStep>
    currentStep: number
}

const Steps = ({ steps, currentStep }: ISteps): JSX.Element => {

    const renderSteps = (): Array<JSX.Element> => {
        return steps.map((x, i) => {
            // const pathParts = window.location.pathname.split('/');
            // const pathStep = pathParts[pathParts.length - 1];
            // const stepNumber = Number.isInteger(parseInt(pathStep, 10)) ? parseInt(pathStep, 10) : 1;
            const stepNumber = currentStep;
            return (
                <Fragment key={x.displayValue}>
                    <div key={x.displayValue} className={styles.stepContainer}>
                        <div className={cx(styles.step, { [styles.active]: stepNumber === i + 1, [styles.finished]: stepNumber > i + 1 })}>
                            {x.displayValue || (i + 1)}
                        </div>
                        <div className={cx(styles.name, { [styles.finished]: stepNumber > i + 1 })}>{x.name}</div>
                    </div>
                    {i < steps.length - 1 && <div className={styles.spacer} />}
                </Fragment>
            );
        });
    };

    return (
        <>
            <section className={styles.container}>
                {renderSteps()}
            </section>
        </>
    );
};

export default Steps;
