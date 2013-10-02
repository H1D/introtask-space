/**
 * Создает экземпляр космического корабля.
 * @name Vessel
 * @param {String} name Название корабля.
 * @param {Number}[] position Местоположение корабля.
 * @param {Number} capacity Грузоподъемность корабля.
 */
function Vessel(name, position, capacity) {
	this.name = name;
	this.position = position;
	this.capacity = capacity;
	this.load = 0;
	this.planet = null;
}

/**
 * Выводит текущее состояние корабля: имя, местоположение, доступную грузоподъемность.
 * @example
 * vessel.report(); // Грузовой корабль. Местоположение: Земля. Товаров нет.
 * @example
 * vesserl.report(); // Грузовой корабль. Местоположение: 50,20. Груз: 200т.
 * @name Vessel.report
 */
Vessel.prototype.report = function () {
	var msg = 'Корабль "'+this.name+'". ';
	msg += 'Местоположение: ' + this.getPositionDisplay() + '. ';
	msg += 'Занято: ' + this.load + ' из ' + this.capacity + 'т.';

	return display(msg);
}

/**
 * Выводит количество свободного места на корабле.
 * @name Vessel.getFreeSpace
 */
Vessel.prototype.getFreeSpace = function () {	
	return this.capacity - this.load;
}

/**
 * Запихивает в корабль груз.
 * @param {Number} capacity Вес груза.
 * @name Vessel.pushCargo
 */
Vessel.prototype.pushCargo = function (cargoWeight) {	
	// а корабль то потянет?
	if (this.getFreeSpace() < cargoWeight) {
		throw Error(err_msg + 'На корабле нет столько свободного места!')
	} else {
		this.load += cargoWeight;
	}
}

/**
 * Выковыривает груз из корабля.
 * @param {Number} capacity Вес груза.
 * @name Vessel.popCargo
 */
Vessel.prototype.popCargo = function (cargoWeight) {	
	// а есть стока добра у нас?
	if (this.load <= cargoWeight) {
		throw Error(err_msg + 'На корабле нет столько груза!')
	} else {
		this.load -= cargoWeight;
	}
}
	
/**
 * Возвращает позицию корабля (название планеты или координаты).
 * @name Vessel.getFreeSpace
 */
Vessel.prototype.getPositionDisplay = function () {	
	if (this.planet) {
		return this.planet.name;
	} else {
		return this.position.join(',')
	}
}
	

/**
 * Выводит количество занятого места на корабле.
 * @name Vessel.getOccupiedSpace
 */
Vessel.prototype.getOccupiedSpace = function () {
	return this.load;
}

/**
 * Переносит корабль в указанную точку.
 * @param {Number}[]|Planet newPosition Новое местоположение корабля.
 * @example
 * vessel.flyTo([1,1]);
 * @example
 * var earth = new Planet('Земля', [1,1]);
 * vessel.flyTo(earth);
 * @name Vessel.flyTo
 */
Vessel.prototype.flyTo = function (newPosition) {
	//стираем прошлые значения 
	this.position = null;
	this.planet = null;
	
	switch (newPosition.constructor){
		case Array:
			this.position = newPosition;
			break;
		case Planet:
			this.planet = newPosition;
			this.position = this.planet.position;
			break;
	}
}

/**
 * Создает экземпляр планеты.
 * @name Planet
 * @param {String} name Название Планеты.
 * @param {Number}[] position Местоположение планеты.
 * @param {Number} availableAmountOfCargo Доступное количество груза.
 */
function Planet(name, position, availableAmountOfCargo) {
	this.name = name;
	this.position = position;
	this.availableAmountOfCargo = availableAmountOfCargo;
}

/**
 * Выводит текущее состояние планеты: имя, местоположение, количество доступного груза.
 * @name Planet.report
 */
 // Планета "A". Местоположение: 0,0. Грузов нет.
Planet.prototype.report = function () {
	var msg = 'Планета "' + this.name+'". ';
	msg += 'Местоположение: '+this.position.join(',')+'. ';
	
	if (this.availableAmountOfCargo <= 0) {
		msg += 'Грузов нет.';
	} else {
		msg += 'Доступно груза: '+this.availableAmountOfCargo+'т.';
	}

	return display(msg);
}

/**
 * Возвращает доступное количество груза планеты.
 * @name Vessel.getAvailableAmountOfCargo
 */
Planet.prototype.getAvailableAmountOfCargo = function () {
	return this.availableAmountOfCargo;
}

/**
 * Загружает на корабль заданное количество груза.
 * 
 * Перед загрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Загружаемый корабль.
 * @param {Number} cargoWeight Вес загружаемого груза.
 * @name Vessel.loadCargoTo
 */
Planet.prototype.loadCargoTo = function (vessel, cargoWeight) {
	var msg = 'Вы пытались загрузить '+cargoWeight+' Т с планеты "'+this.name+'" на корабль "'+vessel.name+'". ';
	
	// корабль тут? 
	if (vessel.planet !== this) {
		throw Error(err_msg + 'Нет такого корабля на планете!');
	}

	// а груза столько есть?
	if (this.availableAmountOfCargo < cargoWeight) {
		throw Error(err_msg + 'На планете нет столько груза!');
	}

	vessel.pushCargo(cargoWeight);
	this.availableAmountOfCargo -= cargoWeight;
}

/**
 * Выгружает с корабля заданное количество груза.
 * 
 * Перед выгрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Разгружаемый корабль.
 * @param {Number} cargoWeight Вес выгружаемого груза.
 * @name Vessel.unloadCargoFrom
 */
Planet.prototype.unloadCargoFrom = function (vessel, cargoWeight) {
	var err_msg = 'Вы пытались разгрузить '+cargoWeight+'т с корабля "'+vessel.name+'" на планету "'+this.name+'". ';

	// корабль тут? 
	if (vessel.planet !== this) {
		throw Error(err_msg + 'Нет такого корабля на планете!');
	}

	vessel.popCargo(cargoWeight);
	this.availableAmountOfCargo += cargoWeight;
}

/**
 * Выводит сообщение в консоль если возможно, иначе возвращает строку обратно
 * 
 * @param {String} msg текст сообщения.
 * @name log
 */
function display(msg){
	if (console) {
		console.log(msg);
	} else {
		return msg;
	}
}
