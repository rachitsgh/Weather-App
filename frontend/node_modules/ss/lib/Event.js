function Event(name,data){

	this._data = {
		name : name,
		data : data,
		aggreType : null,
		aggreId : null,
		time : new Date()
	}

}

var event = Event.prototype;

event.__defineGetter__('aggreType',function(){return this._data.aggreType;});
event.__defineGetter__('aggreId',function(){return this._data.aggreId;});
event.__defineGetter__('time',function(){return this._data.time;});
event.__defineGetter__('name',function(){return this._data.name;});
event.__defineGetter__('data',function(){return this._data.data;});

module.exports = Event;