
import React from 'react';
import ReactDOM from 'react-dom';

import LRIGBasicDisplay from './LRIGBasicDisplay';

/**
 * This is the main entry point of the portlet.
 *
 * See https://tinyurl.com/js-ext-portlet-entry-point for the most recent 
 * information on the signature of this function.
 *
 * @param  {Object} params a hash with values of interest to the portlet
 * @return {void}
 */
export default function main({portletNamespace, contextPath, portletElementId, configuration}) {

    if (JSON.stringify(configuration.portletInstance) === '{}') {

        ReactDOM.render(<span>Please, configure and save the portlet to make it work</span>,
            document.getElementById(portletElementId));


    } else if ( ( (JSON.stringify(configuration.system) === '{}') || configuration.system.userid == "" || configuration.system.token == "" ) &&
            (configuration.portletInstance.userid == "" || configuration.portletInstance.token == "" )) {

        ReactDOM.render(<span>Please, specify both, a valid user ID and token</span>,
            document.getElementById(portletElementId));     

    } else {

        ReactDOM.render(
            <LRIGBasicDisplay 
                portletNamespace={portletNamespace} 
                contextPath={contextPath}
                portletElementId={portletElementId}
                
                configuration={configuration}
                
                />, 
            document.getElementById(portletElementId)
        );

    }

}