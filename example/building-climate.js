'use strict';

/**
 * Track temperature in a room
 */
class BuildingClimate {

    constructor(options = {}) {

        /**
         * Client options
         *
         * @type {CLIENT_OPTIONS}
         * @private
         */
        this._options = {...options };
        this._store = {};
    }
    
    mapHostToRoom(host, room, topic) {
        this._store[host] = { room, topic };
    }

    setClimate(host, climate) {
        this._store[host].climate = climate;
    }

    getHost(host) {
        return this._store[host];
    }

    getHosts() {
        return Object.keys(this._store);
    }

    getRooms() {
        return Object.values(this._store).map(climate => climate.room);
    }

    getClimate(room) {
        return this._store[room];
    }

    getFilteredRooms(filter) {
        return Object.keys(this._store).filter(filter);
    }

}

module.exports = {
    BuildingClimate
};