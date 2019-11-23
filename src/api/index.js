import axios from 'axios'

export function getStationInfo() {
    axios.get('/api/stations')
}
