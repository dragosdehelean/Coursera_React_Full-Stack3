
// 

// IP-ului computerului pe care am instalat json-server este: 192.168.0.101

/**
 * IP-ului computerului pe care am instalat json-server este: 192.168.0.101
 * 
 * Comanda initiala, care NU a functionat a fost: json-server --watch db.json -p 3001 -d 2000
 * 
 *      De pe telefon puteam sa accesez http://192.168.0.101 (servit cu Xampp) insa nu si http://192.168.0.101:3001/...
 * 
 * Solutia:
 * 
 * Comanda care a functionat a fost: json-server --watch db.json --host 0.0.0.0 -p 3001 -d 2000
 *  
 * JSON server spunea ca serveste la 0.0... 
 * insa cand am incercat de pe mobil sa accesez din nou vechiul url- http://192.168.0.101:3001/... a functionat!
 * 
 * Sursa: https://www.coursera.org/learn/react-native/discussions/weeks/2/threads/P5TeirHDEein_Aq6CDcoyg
 * 
 */
// export const baseUrl = 'http://192.168.0.100:3001/' // acasa


export const baseUrl = 'http://10.233.112.165:3001/'; // sediu Vodafone


