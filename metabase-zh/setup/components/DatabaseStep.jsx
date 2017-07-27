/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import StepTitle from './StepTitle.jsx'
import CollapsedStep from "./CollapsedStep.jsx";

import DatabaseDetailsForm from "metabase/components/DatabaseDetailsForm.jsx";
import FormField from "metabase/components/form/FormField.jsx";
import MetabaseAnalytics from "metabase/lib/analytics";
import MetabaseSettings from "metabase/lib/settings";

import _ from "underscore";

export default class DatabaseStep extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = { 'engine': "", 'formError': null };
    }

    static propTypes = {
        stepNumber: PropTypes.number.isRequired,
        activeStep: PropTypes.number.isRequired,
        setActiveStep: PropTypes.func.isRequired,

        databaseDetails: PropTypes.object,
        validateDatabase: PropTypes.func.isRequired,
        setDatabaseDetails: PropTypes.func.isRequired,
    }

    chooseDatabaseEngine() {
        let engine = ReactDOM.findDOMNode(this.refs.engine).value;

        this.setState({
            'engine': engine
        });

        MetabaseAnalytics.trackEvent('Setup', 'Choose Database', engine);
    }

    async detailsCaptured(details) {
        this.setState({
            'formError': null
        });

        // make sure that we are trying ssl db connections to start with
        details.details.ssl = true;

        try {
            // validate the details before we move forward
            await this.props.validateDatabase(details);

        } catch (error) {
            let formError = error;
            details.details.ssl = false;

            try {
                // ssl connection failed, lets try non-ssl
                await this.props.validateDatabase(details);

                formError = null;

            } catch (error2) {
                formError = error2;
            }

            if (formError) {
                MetabaseAnalytics.trackEvent('Setup', 'Error', 'database validation: '+this.state.engine);

                this.setState({
                    'formError': formError
                });

                return;
            }
        }

        // now that they are good, store them
        this.props.setDatabaseDetails({
            'nextStep': this.props.stepNumber + 1,
            'details': details
        });

        MetabaseAnalytics.trackEvent('Setup', 'Database Step', this.state.engine);
    }

    skipDatabase() {
        this.setState({
            'engine': ""
        });

        this.props.setDatabaseDetails({
            'nextStep': this.props.stepNumber + 1,
            'details': null
        });

        MetabaseAnalytics.trackEvent('Setup', 'Database Step');
    }

    renderEngineSelect() {
        let engines = MetabaseSettings.get('engines');
        let { engine } = this.state,
        engineNames = _.keys(engines).sort();

        return (
            <label className="Select Form-offset mt1">
                <select ref="engine" defaultValue={engine} onChange={this.chooseDatabaseEngine.bind(this)}>
                    <option value="">选择你使用的数据库类型</option>
                    {engineNames.map(opt => <option key={opt} value={opt}>{engines[opt]['driver-name']}</option>)}
                </select>
            </label>
        );
    }

    render() {
        let { activeStep, databaseDetails, setActiveStep, stepNumber } = this.props;
        let { engine, formError } = this.state;
        let engines = MetabaseSettings.get('engines');

        let stepText = '添加你的数据';
        if (activeStep > stepNumber) {
            stepText = (databaseDetails === null) ? "稍后添加" : '连接到 '+databaseDetails.name;
        }

        if (activeStep !== stepNumber) {
            return (<CollapsedStep stepNumber={stepNumber} stepText={stepText} isCompleted={activeStep > stepNumber} setActiveStep={setActiveStep}></CollapsedStep>)
        } else {
            return (
                <section className="SetupStep rounded full relative SetupStep--active">
                    <StepTitle title={stepText} number={stepNumber} />
                    <div className="mb4">
                        <div style={{maxWidth: 600}} className="Form-field Form-offset">
                            你需要知道你的数据库的一些信息, 比如用户名和密码.  如果你现在没有, Metabase 会提供你一个示例数据集.
                        </div>

                        <FormField fieldName="engine">
                            {this.renderEngineSelect()}
                        </FormField>

                        { engine !== "" ?
                          <DatabaseDetailsForm
                              details={(databaseDetails && 'details' in databaseDetails) ? databaseDetails.details : null}
                              engine={engine}
                              engines={engines}
                              formError={formError}
                              hiddenFields={{ ssl: true }}
                              submitFn={this.detailsCaptured.bind(this)}
                              submitButtonText={'Next'}>
                          </DatabaseDetailsForm>
                          : null }

                          <div className="Form-field Form-offset">
                              <a className="link" onClick={this.skipDatabase.bind(this)}>我稍后自己添加数据</a>
                          </div>
                    </div>
                </section>
            );
        }
    }
}
