import '../styles/naps.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

function Tree(props) {

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            See NAP
        </Tooltip>
        );

    console.log(props)
    
    //check if node has decendants
    let leftChildren = false;
    let rightChildren = false;

    for (let i = 0; i < props.decentants.length; i++) {
        console.log(props.decentants[i])
        console.log(props.node + "0")
        if(props.decentants[i].startsWith(props.node + "0")) {
            leftChildren = true;
        } 
        if(props.decentants[i].startsWith(props.node + "1")) {
            rightChildren = true;
        } 
    }

    if(props.level === 0) {
        return (
            <div className="tree">
                <div className="oneNodeRow">
                    <div class="node green">
                        <OverlayTrigger
                            placement="right"
                            delay={{ show: 100, hide: 200 }}
                            overlay={renderTooltip}
                        >
                        <div style={{"height": "100%"}}>{props.node}</div>
                        </OverlayTrigger>
                    </div>
                </div>

                {leftChildren || rightChildren ? 
                    <div className="twoNodeRow">
                        <div className="column">
                            
                            {leftChildren ?
                                    <Tree decentants={props.decentants} node={props.node +"0"} level={props.level+1} /> 
                                :
                                <div />
                            }   
                        </div>
                        <div className="column">
                            {rightChildren ?
                                    <Tree decentants={props.decentants} node={props.node +"1"} root={props.level+1} /> 
                                :
                                <div />
                            }
                        </div>
                    </div>
                    : 
                    <div/>}
            </div>
        )
    } else {
        return(
            <div style={{"width":"50%"}}>
            <div class="node">
                <OverlayTrigger
                placement="right"
                delay={{ show: 100, hide: 200 }}
                overlay={renderTooltip}
                >
                    <div style={{"height": "100%"}}>{props.node}</div>
                </OverlayTrigger>
            </div>
            {leftChildren || rightChildren ? 
                <div className="twoNodeRow">
                    <div className="column">
                        {/* <div className="lineLeft" style={}/> */}
                        {leftChildren ?
                            <Tree decentants={props.decentants} node={props.node +"0"} level={props.level+1} /> 
                            :
                            <div />
                        }   
                    </div>
                    <div className="column">
                    {/* <div className="lineRight" /> */}
                        {rightChildren ?
                            <Tree decentants={props.decentants} node={props.node +"1"} root={props.level+1} /> 
                            :
                            <div />
                        }
                    </div>
                </div>
                : 
                <div />}
            </div>
        )
    }
}

export default Tree;