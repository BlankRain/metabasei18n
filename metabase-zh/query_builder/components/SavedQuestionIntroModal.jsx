import React, { Component } from "react";

import Modal from "metabase/components/Modal.jsx";


export default class SavedQuestionIntroModal extends Component {

    render() {
        return (
            <Modal small isOpen={this.props.isShowingNewbModal}>
                <div className="Modal-content Modal-content--small NewForm">
                    <div className="Modal-header Form-header">
                        <h2 className="pb2 text-dark">可以使用保存后的问题来玩</h2>

                        <div className="pb1 text-grey-4">你不会对一个保存后的问题有任何影响,除非你点击了右上角的编辑按钮.</div>
                    </div>

                    <div className="Form-actions flex justify-center py1">
                        <button data-metabase-event={"QueryBuilder;IntroModal"} className="Button Button--primary" onClick={() => this.props.onClose()}>好的</button>
                    </div>
                </div>
            </Modal>
        );
    }
}
