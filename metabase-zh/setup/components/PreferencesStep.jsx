/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";

import MetabaseAnalytics from "metabase/lib/analytics";
import MetabaseSettings from "metabase/lib/settings";
import Toggle from "metabase/components/Toggle.jsx";

import StepTitle from './StepTitle.jsx';
import CollapsedStep from "./CollapsedStep.jsx";


export default class PreferencesStep extends Component {

    static propTypes = {
        stepNumber: PropTypes.number.isRequired,
        activeStep: PropTypes.number.isRequired,
        setActiveStep: PropTypes.func.isRequired,

        allowTracking: PropTypes.bool.isRequired,
        setAllowTracking: PropTypes.func.isRequired,
        setupComplete: PropTypes.bool.isRequired,
        submitSetup: PropTypes.func.isRequired,
    }

    toggleTracking() {
        let { allowTracking } = this.props;

        this.props.setAllowTracking(!allowTracking);
    }

    async formSubmitted(e) {
        e.preventDefault();

        // okay, this is the big one.  we actually submit everything to the api now and complete the process.
        this.props.submitSetup();

        MetabaseAnalytics.trackEvent('Setup', 'Preferences Step', this.props.allowTracking);
    }

    render() {
        let { activeStep, allowTracking, setupComplete, stepNumber, setActiveStep } = this.props;
        const { tag } = MetabaseSettings.get('version');

        let stepText = '使用数据参考';
        if (setupComplete) {
            stepText = allowTracking ? "感谢帮助我们提升" : "我们不收集使用信息";
        }

        if (activeStep !== stepNumber || setupComplete) {
            return (<CollapsedStep stepNumber={stepNumber} stepText={stepText} isCompleted={setupComplete} setActiveStep={setActiveStep}></CollapsedStep>)
        } else {
            return (
                <section className="SetupStep rounded full relative SetupStep--active">
                    <StepTitle title={stepText} number={stepNumber} />
                    <form onSubmit={this.formSubmitted.bind(this)} noValidate>
                        <div className="Form-field Form-offset">
                           为了帮助我们提升,我们会根据谷歌分析来收集数据.  <a className="link" href={"http://www.metabase.com/docs/"+tag+"/information-collection.html"} target="_blank">这里有我们追踪数据的清单和原因.</a>
                        </div>

                        <div className="Form-field Form-offset mr4">
                            <div style={{borderWidth: "2px"}} className="flex align-center bordered rounded p2">
                                <Toggle value={allowTracking} onChange={this.toggleTracking.bind(this)} className="inline-block" />
                                <span className="ml1">允许匿名收集信息</span>
                            </div>
                        </div>

                        { allowTracking ?
                            <div className="Form-field Form-offset">
                                <ul style={{listStyle: "disc inside", lineHeight: "200%"}}>
                                    <li>Metabase <span style={{fontWeight: "bold"}}>永远不会</span> 收集您的查询数据.</li>
                                    <li>所有的收集都是匿名的.</li>
                                    <li>你任何时候都可以关闭是否收集.</li>
                                </ul>
                            </div>
                        : null }

                        <div className="Form-actions">
                            <button className="Button Button--primary">
                                下一步
                            </button>
                            { /* FIXME: <mb-form-message form="usageForm"></mb-form-message>*/ }
                        </div>
                    </form>
                </section>
            );
        }
    }
}
