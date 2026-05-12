import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    vus: 10, // virtual users
    duration: '30s',
};

export default function () {
    http.get('https://undangan-syifadaffa.vercel.app/');
    // sleep(1);
}