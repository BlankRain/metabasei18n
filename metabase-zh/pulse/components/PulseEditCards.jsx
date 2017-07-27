/* eslint "react/prop-types": "warn" */
import React, { Component } from "react";
import PropTypes from "prop-types";

import CardPicker from "./CardPicker.jsx";
import PulseCardPreview from "./PulseCardPreview.jsx";

import MetabaseAnalytics from "metabase/lib/analytics";

const SOFT_LIMIT = 10;
const HARD_LIMIT = 25;

export default class PulseEditCards extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static propTypes = {
        pulse: PropTypes.object.isRequired,
        pulseId: PropTypes.number,
        cardPreviews: PropTypes.object.isRequired,
        cards: PropTypes.object.isRequired,
        cardList: PropTypes.array.isRequired,
        fetchPulseCardPreview: PropTypes.func.isRequired,
        setPulse: PropTypes.func.isRequired
    };
    static defaultProps = {};

    setCard(index, cardId) {
        let { pulse } = this.props;
        this.props.setPulse({
            ...pulse,
            cards: [...pulse.cards.slice(0, index), { id: cardId }, ...pulse.cards.slice(index + 1)]
        });

        MetabaseAnalytics.trackEvent((this.props.pulseId) ? "PulseEdit" : "PulseCreate", "AddCard", index);
    }

    removeCard(index) {
        let { pulse } = this.props;
        this.props.setPulse({
            ...pulse,
            cards: [...pulse.cards.slice(0, index), ...pulse.cards.slice(index + 1)]
        });

        MetabaseAnalytics.trackEvent((this.props.pulseId) ? "PulseEdit" : "PulseCreate", "RemoveCard", index);
    }

    getWarnings(cardPreview, showSoftLimitWarning) {
        let warnings = [];
        if (cardPreview) {
            if (cardPreview.pulse_card_type === "bar" && cardPreview.row_count > 10) {
                warnings.push({
                    head: "注意啦",
                    body: "这是一张大表,在pulse中使用它的化,我们得修整一下它.所以,最大显示为两列十行."
                });
            }
            if (cardPreview.pulse_card_type == null) {
                warnings.push({
                    head: "注意啦",
                    body: "这张卡片在pulse中没法显示"
                });
            }
        }
        if (showSoftLimitWarning) {
            warnings.push({
                head: "好像pulse太大",
                body: "我们建议建立小的可调试的pulse."
            });
        }
        return warnings;
    }

    renderCardWarnings(card, index) {
        let cardPreview = card && this.props.cardPreviews[card.id];
        let warnings = this.getWarnings(cardPreview, index === SOFT_LIMIT);
        if (warnings.length > 0) {
            return (
                <div className="absolute" style={{ width: 400, marginLeft: 420 }}>
                    {warnings.map(warning =>
                        <div className="text-gold border-gold border-left mt1 mb2 ml3 pl3" style={{ borderWidth: 3 }}>
                            <h3 className="mb1">{warning.head}</h3>
                            <div className="h4">{warning.body}</div>
                        </div>
                    )}
                </div>
            )
        }
    }

    render() {
        let { pulse, cards, cardList, cardPreviews } = this.props;

        let pulseCards = pulse ? pulse.cards.slice() : [];
        if (pulseCards.length < HARD_LIMIT) {
            pulseCards.push(null);
        }

        return (
            <div className="py1">
                <h2>选取你的数据</h2>
                <p className="mt1 h4 text-bold text-grey-3">请为这个pulse选取五个你关心的问题</p>
                <ol className="my3">
                    {cards && pulseCards.map((card, index) =>
                        <li key={index} className="my1">
                            { index === SOFT_LIMIT && <div className="my4 ml3" style={{ width: 375, borderTop: "1px dashed rgb(214,214,214)"}}/> }
                            <div className="flex align-top">
                                <div className="flex align-top" style={{ width: 400 }}>
                                    <span className="h3 text-bold mr1 mt2">{index + 1}.</span>
                                    { card ?
                                        <PulseCardPreview
                                            card={card}
                                            cardPreview={cardPreviews[card.id]}
                                            onRemove={this.removeCard.bind(this, index)}
                                            fetchPulseCardPreview={this.props.fetchPulseCardPreview}
                                        />
                                    :
                                        <CardPicker
                                            cardList={cardList}
                                            onChange={this.setCard.bind(this, index)}
                                        />
                                    }
                                </div>
                                {this.renderCardWarnings(card, index)}
                            </div>
                        </li>
                    )}
                </ol>
            </div>
        );
    }
}
