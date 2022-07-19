const SIDEOUT = "sideout";
const CHANGE_SERVER = "change_server";
const POINT = "point";

module.exports = function gameGraph() {
  this.data = [];

  const getNode = node_action => {
    return { [node_action]: Date.now() };
  };

  this.point = () => {
    this.data.push(getNode(POINT));
  };
  this.sideout = () => {
    this.data.push(getNode(SIDEOUT));
  };
  this.changeServer = () => {
    this.data.push(getNode(CHANGE_SERVER));
  };
  this.undo = () => {
    return this.data.pop();
  };
  this.reset = () => {
    return;
  };
  this.print = () => {
    console.log(this.data);
  };
  this.validateGraph = sample_graph => {
    // Always assume team A starts,
    // Goal is to get true or false for a valid graph and then the readable score
    return false, null;
  };
};
