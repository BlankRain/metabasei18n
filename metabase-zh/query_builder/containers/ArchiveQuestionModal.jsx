import React, { Component } from "react"
import { connect } from "react-redux"

import Button from "metabase/components/Button"
import Icon from "metabase/components/Icon"
import ModalWithTrigger from "metabase/components/ModalWithTrigger"
import Tooltip from "metabase/components/Tooltip"

import { archiveQuestion } from "metabase/query_builder/actions"

const mapStateToProps = () => ({})

const mapDispatchToProps = {
    archiveQuestion
}

@connect(mapStateToProps, mapDispatchToProps)
class ArchiveQuestionModal extends Component {
    onArchive = async () => {
        try {
            await this.props.archiveQuestion()
            this.onClose();
        } catch (error) {
            console.error(error)
            this.setState({ error })
        }
    }

    onClose = () => {
        if (this.refs.archiveModal) {
            this.refs.archiveModal.close();
        }
    }

    render () {
        return (
            <ModalWithTrigger
                ref="archiveModal"
                triggerElement={
                    <Tooltip key="archive" tooltip="Archive">
                        <span className="text-brand-hover">
                            <Icon name="archive" size={16} />
                        </span>
                    </Tooltip>
                }
                title="打包这个提问?"
                footer={[
                    <Button key='cancel' onClick={this.onClose}>取消</Button>,
                    <Button key='archive' warning onClick={this.onArchive}>打包</Button>
                ]}
            >
                <div className="px4 pb4">这个提问将会从正在使用它的dashboards或者 pulses中移除.</div>
            </ModalWithTrigger>
        )
    }
}

export default ArchiveQuestionModal
