module.exports = ServiceBus;

function ServiceBus(my){

    this._my = my;

	var services = {};
	
	this.bind = function(serviceName,service){
		services[serviceName] = service;	
	}

	this.exec = function(serviceName,args){
		services[serviceName](args,this._my);
   	}

}
