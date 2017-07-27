import React from 'react';
import MetabaseAnalytics from 'metabase/lib/analytics';

const EmbeddingLegalese = ({ updateSetting }) =>
    <div className="bordered rounded text-measure p4">
        <h3 className="text-brand">使用 embedding</h3>
        <p className="text-grey-4" style={{ lineHeight: 1.48 }}>
            要开启embedding模式,您得同意我们的条例. 它位于: <a className="link"  href="http://www.metabase.com/license/embedding" target="_blank">metabase.com/license/embedding</a>.
        </p>
        <p className="text-grey-4" style={{ lineHeight: 1.48 }}>            简单说,当你在你的应用里集成了图表和仪表盘,我们要求你保留 Metabase 的logo 和 "Powered by Metabase"在集成的功能上.
           你该仔细读读上面提到的授权条例,当你真的决定要在应用里集成metabase的时候.
        </p>
        {/* TODO: contact form link */}
        {/* <p className="text-grey-4" style={{ lineHeight: 1.48 }}>
            If you want to hide the Metabase logo inside your own application we'd love to get in touch.
        </p> */}
        <div className="flex layout-centered mt4">
            <button
                className="Button Button--primary"
                onClick={() => {
                    MetabaseAnalytics.trackEvent("Admin Embed Settings", "Embedding Enable Click");
                    updateSetting(true);
                }}
            >
                开启
            </button>
        </div>
    </div>

export default EmbeddingLegalese;
