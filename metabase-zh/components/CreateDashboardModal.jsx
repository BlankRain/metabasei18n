import React, { Component } from "react";
import PropTypes from "prop-types";

import FormField from "metabase/components/FormField.jsx";
import ModalContent from "metabase/components/ModalContent.jsx";
import Button from "metabase/components/Button.jsx";

export default class CreateDashboardModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.createNewDash = this.createNewDash.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setName = this.setName.bind(this);

        this.state = {
            name: null,
            description: null,
            errors: null
        };
    }

    static propTypes = {
        createDashboardFn: PropTypes.func.isRequired,
        onClose: PropTypes.func
    };

    setName(event) {
        this.setState({ name: event.target.value });
    }

    setDescription(event) {
        this.setState({ description: event.target.value });
    }

    createNewDash(event) {
        event.preventDefault();

        var name = this.state.name && this.state.name.trim();
        var description = this.state.description && this.state.description.trim();

        // populate a new Dash object
        var newDash = {
            name: (name && name.length > 0) ? name : null,
            description: (description && description.length > 0) ? description : null
        };

        // create a new dashboard
        var component = this;
        this.props.createDashboardFn(newDash).then(null, function(error) {
            component.setState({
                errors: error
            });
        });
    }

    render() {
        var formError;
        if (this.state.errors) {
            var errorMessage = "服务器错误";
            if (this.state.errors.data &&
                this.state.errors.data.message) {
                errorMessage = this.state.errors.data.message;
            }

            // TODO: timeout display?
            formError = (
                <span className="text-error px2">{errorMessage}</span>
            );
        }

        var name = this.state.name && this.state.name.trim();

        var formReady = (name !== null && name !== "");

        return (
            <ModalContent
                id="CreateDashboardModal"
                title="创建DashBoard"
                footer={[
                    formError,
                    <Button onClick={this.props.onClose}>取消</Button>,
                    <Button primary={formReady} disabled={!formReady} onClick={this.createNewDash}>创建</Button>
                ]}
                onClose={this.props.onClose}
            >
                <form className="Modal-form" onSubmit={this.createNewDash}>
                    <div className="Form-inputs">
                        <FormField
                            displayName="名称"
                            fieldName="name"
                            errors={this.state.errors}
                        >
                            <input className="Form-input full" name="name" placeholder="该怎么称呼你的dashboard?" value={this.state.name} onChange={this.setName} autoFocus />
                        </FormField>

                        <FormField
                            displayName="描述"
                            fieldName="description"
                            errors={this.state.errors}
                        >
                            <input className="Form-input full" name="description" placeholder="这是可选项,但是很有用"  value={this.state.description} onChange={this.setDescription} />
                        </FormField>
                    </div>
                </form>
            </ModalContent>
        );
    }
}
