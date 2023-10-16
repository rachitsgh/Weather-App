module.exports = CommandBus;

function CommandBus(my){
    
    this._my = my;

	var handles = {};

	this.bind = function(commandName,handle){
		handles[commandName] = handle;
	}

	this.exec = function(commandName,args){
		handles[commandName](args,this._my);
	}
}
