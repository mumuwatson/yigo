import projectJSON from './project.json';
import debugProjectJSON from './project.debug.json';

let data = debugProjectJSON;
if(__VERSION__==="release"){
    data = projectJSON;
}

export default data;
