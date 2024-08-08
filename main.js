const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const checkInternetConnected = require('check-internet-connected');
const { count, Console } = require('console');

let mainWindow;
let loadingWindow;
let userWindow;
let db;
let dBorNo, userData, dataUpdate, verifyUser, nacionalidad, paises, datosNacionalidad;

function createLoadingWindow() {
    loadingWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        transparent: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    loadingWindow.loadFile('./src/res/ventanas/splashScreen.html');
    loadingWindow.on('closed', () => {
        loadingWindow = null;
    });

    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        loadingWindow.webContents.send('update-progress', progress);
        if (progress >= 25) {
            clearInterval(interval);
            checkAndCreateDatabase();
        }
    }, 50);
}

function createNacionalidad(datos) {

    nacionalidad = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    nacionalidad.loadFile('./src/res/ventanas/nacionalidad.html');

    nacionalidad.webContents.on('did-finish-load', () => {
        nacionalidad.webContents.send('datos-capturados', datos);
    });

    nacionalidad.on('closed', () => {
        nacionalidad = null;
    });


}

function createFamilia() {

    familia = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    familia.loadFile('./src/res/ventanas/familia.html');
    familia.webContents.on('did-finish-load', () => {
        familia.webContents.send('datos-capturadosFamilia', datos);
    });
    familia.on('closed', () => {
        familia = null;
    });
    
}

function createPersona(datos) {

    persona = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    persona.loadFile('./src/res/ventanas/persona.html');

    persona.webContents.on('did-finish-load', () => {
        persona.webContents.send('datos-nacionalidad', datos);
    });

    persona.on('closed', () => {
        persona = null;
    });
}

function createLoginWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('./src/res/ventanas/log-in.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createCaptureOnline(userData) {
    userWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    userWindow.loadFile('./src/res/ventanas/capturaOnline.html');
    userWindow.on('closed', () => {
        userWindow = null;
    });

    userWindow.webContents.on('did-finish-load', () => {
        userWindow.webContents.send('user-data', userData);
    });
}

function createCaptureOffline() {
    userWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    userWindow.loadFile('./src/res/ventanas/capturaOffline.html');
    userWindow.on('closed', () => {
        userWindow = null;
    });

    userWindow.webContents.on('did-finish-load', () => {
        userWindow.webContents.send('user-data', userData);
    });
}

function initializeDatabase() {
    return new Promise((resolve, reject) => {
        const currentDirectory = __dirname;
        const dbPath = path.join(currentDirectory, 'mydb.db');
        console.log('Database path:', dbPath);

        if (!fs.existsSync(dbPath)) {
            console.log('Database does not exist. Creating...');
            dBorNo = 0;
            db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                } else {
                    console.log('Database opened successfully.');
                    db.serialize(() => {
                        db.run(`
                            CREATE TABLE IF NOT EXISTS "Users" (
                                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                "nickname" TEXT,
                                "nombre" TEXT,
                                "apellido" TEXT,
                                "password" TEXT,
                                "estado" TEXT,
                                "tipo" TEXT
                            )
                        `, (err) => {
                            if (err) {
                                console.error('Error creating Users table:', err);
                                reject(err);
                            } else {
                                console.log('Users table created or already exists.');
                            }
                        });

                        db.run(`
                            CREATE TABLE IF NOT EXISTS "Rescates" (
                                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                "oficinaRepre" TEXT,
                                "fecha" TEXT,
                                "hora" TEXT,
                                "nombreAgente" TEXT,
                                "aeropuerto" BOOLEAN,
                                "carretero" BOOLEAN,
                                "tipoVehic" TEXT,
                                "lineaAutobus" TEXT,
                                "numeroEcono" TEXT,
                                "placas" TEXT,
                                "vehiculoAseg" BOOLEAN,
                                "casaSeguridad" BOOLEAN,
                                "centralAutobus" BOOLEAN,
                                "ferrocarril" BOOLEAN,
                                "empresa" TEXT,
                                "hotel" BOOLEAN,
                                "nombreHotel" TEXT,
                                "puestosADispo" BOOLEAN,
                                "juezCalif" BOOLEAN,
                                "reclusorio" BOOLEAN,
                                "policiaFede" BOOLEAN,
                                "dif" BOOLEAN,
                                "policiaEsta" BOOLEAN,
                                "policiaMuni" BOOLEAN,
                                "guardiaNaci" BOOLEAN,
                                "fiscalia" BOOLEAN,
                                "otrasAuto" BOOLEAN,
                                "voluntarios" BOOLEAN,
                                "otro" BOOLEAN,
                                "presuntosDelincuentes" BOOLEAN,
                                "numPresuntosDelincuentes" INT,
                                "municipio" TEXT,
                                "puntoEstra" TEXT,
                                "nacionalidad" TEXT,
                                "iso3" TEXT,
                                "nombre" TEXT,
                                "apellidos" TEXT,
                                "noIdentidad" TEXT,
                                "parentesco" TEXT,
                                "fechaNacimiento" TEXT,
                                "sexo" BOOLEAN,
                                "embarazo" BOOLEAN,
                                "numFamilia" INT,
                                "edad" INT
                            )
                        `, (err) => {
                            if (err) {
                                console.error('Error creating Rescates table:', err);
                                reject(err);
                            } else {
                                console.log('Rescates table created or already exists.');
                                resolve();
                            }
                        });


                        db.run(`
                            CREATE TABLE IF NOT EXISTS "Puntos" (
                                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                "nombre" TEXT,
                                "estado" TEXT,
                                "tipo" TEXT
                            )
                        `, (err) => {
                            if (err) {
                                console.error('Error creating Puntos table:', err);
                                reject(err);
                            } else {
                                console.log('Puntos table created or already exists.');
                                resolve();
                            }
                        });

                        db.run(`
                            CREATE TABLE IF NOT EXISTS "Paises" (
                                "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                                "nombre_pais" TEXT,
                                "iso3" TEXT
                            )
                        `, (err) => {
                            if (err) {
                                console.error('Error creating Paises table:', err);
                                reject(err);
                            } else {
                                console.log('Paises table created or already exists.');
                                resolve();
                            }
                        });
                    });
                }
            });
        } else {
            dBorNo = 1;
            db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error opening existing database:', err);
                    reject(err);
                } else {
                    console.log('Existing database opened successfully.');
                    resolve();
                }
            });
        }
    });
}

async function checkForUser() {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error('La base de datos no está abierta.');
            reject(new Error('La base de datos no está abierta.'));
            return;
        }

        db.get('SELECT * FROM Users LIMIT 1', (err, row) => {
            if (err) {
                console.error('Error al consultar la base de datos:', err);
                resolve(false);
            } else if (row) {
                userData = row;
                console.log('Usuario encontrado:', row);
                resolve(true);
            } else {
                console.log('No se encontró usuario');
                resolve(false);
            }
        });
    });
}

function checkAndCreateDatabase() {
    initializeDatabase()
        .then(() => {
            console.log('Database check and creation complete.');
            if (loadingWindow) {
                let progress = 25;
                const resumeInterval = setInterval(() => {
                    progress += 1;
                    console.log(`Resuming loading progress: ${progress}%`);
                    loadingWindow.webContents.send('update-progress', progress);

                    if (progress >= 50) {
                        if(dBorNo == 1){
                            clearInterval(resumeInterval);
                            findUser();
                        }
                    }

                    if(progress >= 100){
                        clearInterval(resumeInterval);
                        loadingWindow.close();
                        createLoginWindow();
                    }
                }, 50);
            }
        })
        .catch((err) => {
            console.error('Error during database initialization:', err);
        });
}

function findUser() {
    checkForUser()
        .then((userExists) => {
            console.log('User check complete.');
            if (loadingWindow) {
                let progress = 50;
                const resumeInterval = setInterval(() => {
                    progress += 1;
                    console.log(`Resuming loading progress: ${progress}%`);
                    loadingWindow.webContents.send('update-progress', progress);

                    if (userExists) {
                        if (progress >= 75) {
                            clearInterval(resumeInterval);
                            checkNetwork();
                        }
                    } else {
                        if (progress >= 100) {
                            clearInterval(resumeInterval);
                            loadingWindow.close();
                            createLoginWindow();
                        }
                    }
                }, 50);
            }
        })
        .catch((err) => {
            console.error('Error during user check:', err);
        });
}

function checkNetwork() {
    const config = {
        timeout: 10000,
        retries: 3,
        domain: 'ruie.dgcor.com'
    };
    checkInternetConnected(config)
        .then(() => {
            console.log("Conexión disponible");
            if (loadingWindow) {
                let progress = 75;
                const resumeInterval = setInterval(() => {
                    progress += 1;
                    console.log(`Resuming loading progress: ${progress}%`);
                    loadingWindow.webContents.send('update-progress', progress);

                    if (progress >= 85) {
                        clearInterval(resumeInterval);
                        actualizarUser();
                    }
                }, 50);
            }
        })
        .catch((err) => {
            console.log("No hay conexión", err);
            if (loadingWindow) {
                let progress = 75;
                const resumeInterval = setInterval(() => {
                    progress += 1;
                    console.log(`Resuming loading progress: ${progress}%`);
                    loadingWindow.webContents.send('update-progress', progress);

                    if (progress >= 100) {
                        clearInterval(resumeInterval);
                        loadingWindow.close();
                        createCaptureOffline();
                    }
                }, 50);
            }
        });
}

function actualizarUser() {
    updateUser(userData.nickname, userData.password)
        .then(() => {
            console.log('User update complete.');

            if (loadingWindow) {
                let progress = 85;
                const resumeInterval = setInterval(() => {
                    progress += 1;
                    console.log(`Resuming loading progress: ${progress}%`);
                    loadingWindow.webContents.send('update-progress', progress);
                    if (progress >= 90) {
                        clearInterval(resumeInterval);

                        if (verifyUser == 0) {
                            loadingWindow.close();
                            createLoginWindow();
                        } else {
                            getPuntos();
                        }
                    }

                    // if (progress >= 100) {
                    //     clearInterval(resumeInterval);
                    //     loadingWindow.close();
                    //     if (verifyUser == 0) {
                    //         loadingWindow.close();
                    //         createLoginWindow();
                    //     } else {
                    //         loadingWindow.close();
                    //         createCaptureOnline(dataUpdate);
                    //     }
                    // }

                }, 50);
            }


        })
        .catch((err) => {
            console.error('Error during user check:', err);
        });
}

function getPuntos() {
    obtenerPuntos(dataUpdate)
        .then(() => {
            console.log('Puntos update complete.');

            if (loadingWindow) {
                let progress = 90;
                const resumeInterval = setInterval(() => {
                    progress += 1;
                    console.log(`Resuming loading progress: ${progress}%`);
                    loadingWindow.webContents.send('update-progress', progress);
                    if (progress >= 100) {
                        clearInterval(resumeInterval);
                        loadingWindow.close();
                        createCaptureOnline(dataUpdate);
                    }


                }, 50);
            }


        })
        .catch((err) => {
            console.error('Error during user check:', err);
        });
}

async function obtenerPuntos(dataUpdate) {
    try {
        // Verificar que la base de datos esté inicializada
        if (!db) {
            console.error('Database is not initialized.');
            return;
        }

        // Borrar todos los registros de la tabla Puntos
        await new Promise((resolve, reject) => {
            db.run('DELETE FROM Puntos', (err) => {
                if (err) {
                    console.error('Error al borrar los puntos de la base de datos:', err);
                    reject(err);
                } else {
                    console.log('Todos los puntos han sido borrados de la base de datos.');
                    resolve();
                }
            });
        });

        const [data1, data2, data3, data4] = await Promise.all([
            fetch('https://ruie.dgcor.com/info/Fuerza').then(response => response.json()),
            fetch('https://ruie.dgcor.com/info/PuntosI').then(response => response.json()),
            fetch('http://ruie.dgcor.com/info/Municipios').then(response => response.json()),
            fetch('http://ruie.dgcor.com/info/Paises').then(response => response.json()),
        ]);

        const estadoMap = {
            '1': 'AGUASCALIENTES',
            '2': 'BAJA CALIFORNIA',
            '3': 'BAJA CALIFORNIA SUR',
            '4': 'CAMPECHE',
            '5': 'COAHUILA',
            '6': 'COLIMA',
            '7': 'CHIAPAS',
            '8': 'CHIHUAHUA',
            '9': 'CDMX',
            '10': 'DURANGO',
            '11': 'GUANAJUATO',
            '12': 'GUERRERO',
            '13': 'HIDALGO',
            '14': 'JALISCO',
            '15': 'EDOMEX',
            '16': 'MICHOACÁN',
            '17': 'MORELOS',
            '18': 'NAYARIT',
            '19': 'NUEVO LEÓN',
            '20': 'OAXACA',
            '21': 'PUEBLA',
            '22': 'QUERÉTARO',
            '23': 'QUINTANA ROO',
            '24': 'SAN LUIS POTOSÍ',
            '25': 'SINALOA',
            '26': 'SONORA',
            '27': 'TABASCO',
            '28': 'TAMAULIPAS',
            '29': 'TLAXCALA',
            '30': 'VERACRUZ',
            '31': 'YUCATÁN',
            '32': 'ZACATECAS'
        };

        const estado = estadoMap[dataUpdate.estado] || 'Estado desconocido';
        const oficinaR = estado;
        console.log(oficinaR);
        let puntosFiltrados = [];

        const puntosDeRevision = data1.map(punto => ({
            nombre: punto.nomPuntoRevision,
            estado: punto.oficinaR,
            tipo: punto.tipoP
        }));

        const puntosInternacion = data2.map(punto => ({
            nombre: punto.nombrePunto,
            estado: punto.estadoPunto,
            tipo: punto.tipoPunto
        }));

        const Municipios = data3.map(punto => ({
            nombre: punto.nomMunicipio,
            estado: punto.estado,
            tipo: 'Hotel'
        }));

        const puntosUnificados = [...puntosDeRevision, ...puntosInternacion, ...Municipios];
        puntosFiltrados = puntosUnificados.filter(punto => punto.estado === oficinaR);
        console.log(puntosFiltrados);

        
        const stmt = db.prepare(`
            INSERT INTO Puntos (nombre, estado, tipo)
            VALUES (?, ?, ?)
        `);

        try {
            for (const punto of puntosFiltrados) {
                await new Promise((resolve, reject) => {
                    stmt.run(punto.nombre, punto.estado, punto.tipo, (err) => {
                        if (err) {
                            console.error('Error al guardar punto en la base de datos:', err);
                            reject(err);
                        } else {
                            console.log('Punto guardado en la base de datos:', punto);
                            resolve();
                        }
                    });
                });
            }
        } catch (err) {
            console.error('Error durante la inserción de puntos:', err);
        } finally {
            // Finalizar la declaración después de usarla
            stmt.finalize();
        }


        const st = db.prepare(`
            SELECT COUNT(*) AS count FROM Paises
        `);
        
        try {
            const result = await new Promise((resolve, reject) => {
                st.get((err, row) => {
                    if (err) {
                        console.error('Error al contar paises en la base de datos:', err);
                        reject(err);
                    } else {
                        console.log('Paises contados:', row.count);
                        paises = row.count;
                        resolve(row.count);
                    }
                });
            });
            console.log('Resultado:', result);
        } catch (err) {
            console.error('Error durante el conteo de paises:', err);
        } finally {

            st.finalize();
        }
        
        if(paises == 249){
            console.log("Los paises ya estan");
        }else {


            const stmm = db.prepare(`
                DELETE FROM Paises
            `);

            stmm.run((err) => {
                if (err) {
                    console.error('Error deleting Pais to database:', err);
                } else {
                    console.log('Paises eliminados');
                }
                stmm.finalize();
            });

            const stm = db.prepare(`
                INSERT INTO Paises (nombre_pais, iso3)
                VALUES (?,?)
            `);
    
            try {
                for (const pais of data4) {
                    await new Promise((resolve, reject) => {
                        stm.run(pais.nombre_pais, pais.iso3, (err) => {
                            if (err) {
                                console.error('Error al guardar pais en la base de datos:', err);
                                reject(err);
                            } else {
                                console.log('Paises guardados en la base de datos:', pais);
                                resolve();
                            }
                        });
                    });
                }
            } catch (err) {
                console.error('Error durante la inserción de paises:', err);
            } finally {

                stm.finalize();
            }
        }
        
    } catch (err) {
        console.error(err);
    }
}


async function updateUser(nickname, password) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'insomnia/9.2.0'
        },
        body: JSON.stringify({ nickname, password })
    };

    try {
        const response = await fetch('http://ruie.dgcor.com/login/validar/?=', options);
        const data = await response.json();

        if (data.nickname === 'error' && data.password === 'error') {
            console.log("Usuario y/o contraseña desactualizados");
            verifyUser = 0;



            if (!db) {
                console.error('Database is not initialized.');
                return;
            }

            const stmt = db.prepare(`
                DELETE FROM USERS
            `);

            stmt.run((err) => {
                if (err) {
                    console.error('Error deleting user to database:', err);
                } else {
                    console.log('Usuarios eliminados');
                }
                stmt.finalize();
            });
        } else {
            verifyUser = 1;
            data.password = password;
            console.log(data);

            if (!db) {
                console.error('Database is not initialized.');
                return;
            }

            const stmt = db.prepare(`
                UPDATE Users SET  nickname = ?, nombre = ?, apellido = ?, password = ?, estado = ?, tipo = ?
                where id = ?
            `);

            dataUpdate = data;
            stmt.run(data.nickname, data.nombre, data.apellido, data.password, data.estado, data.tipo, userData.id, (err) => {
                if (err) {
                    console.error('Error saving user to database:', err);
                } else {
                    console.log('User saved to database successfully.');
                }
                stmt.finalize();
            });

        }
    } catch (err) {
        console.error(err);
    }
}

ipcMain.on('save-user-to-db', (event, userData) => {
    if (!db) {
        console.error('Database is not initialized.');
        return;
    }

    const stmt = db.prepare(`
        INSERT INTO Users (nickname, nombre, apellido, password, estado, tipo)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(userData.nickname, userData.nombre, userData.apellido, userData.password, userData.estado, userData.tipo, (err) => {
        if (err) {
            console.error('Error saving user to database:', err);
        } else {
            console.log('User saved to database successfully.');
        }
        stmt.finalize();
    });
});

ipcMain.on('createThenLogin', (event, validado) => {
    console.log(validado);
    if (mainWindow) {
        mainWindow.close(); // Cierra la ventana de inicio de sesión
    }
    createLoadingWindow(); // Vuelve a crear la ventana de carga
});
app.on('ready', createLoadingWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createLoadingWindow();
    }
});



ipcMain.handle('guardarPuntosEnDB', async (event, puntos) => {
    // Preparar la declaración de inserción
    const stmt = db.prepare(`
        INSERT INTO Puntos (nombre, estado, tipo)
        VALUES (?, ?, ?)
    `);

    try {
        for (const punto of puntos) {
            await new Promise((resolve, reject) => {
                stmt.run(punto.nombre, punto.estado, punto.tipo, (err) => {
                    if (err) {
                        console.error('Error al guardar punto en la base de datos:', err);
                        reject(err);
                    } else {
                        console.log('Punto guardado en la base de datos:', punto);
                        resolve();
                    }
                });
            });
        }
    } catch (err) {
        console.error('Error durante la inserción de puntos:', err);
    } finally {
        // Finalizar la declaración después de usarla
        stmt.finalize();
    }
});


ipcMain.handle('obtenerPuntosDeDB', async (event) => {
    try {
        // Verificar que la base de datos esté inicializada
        if (!db) {
            console.error('Database is not initialized.');
            return;
        }

        const puntos = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM Puntos', (err, rows) => {
                if (err) {
                    console.error('Error al obtener los puntos de la base de datos:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return puntos;
    } catch (err) {
        console.error('Error durante la obtención de puntos:', err);
        throw err;
    }
});

ipcMain.on('abrir-nueva-ventana', (event,datos) => {

    if (userWindow) {
        userWindow.close();
    }
    datosNacionalidad = datos;
    createNacionalidad(datos);
    console.log('Datos recibidos en nacionalidad:', datos);
});


ipcMain.on('familia', () => {

    if (userWindow) {
        userWindow.close();
    }
    createFamilia();

});

ipcMain.on('cerrarNacionalidadCrearPersona', (event,datos) => {
    // Cerrar la ventana actual de capturaOnline si existe
    if (nacionalidad) {
        nacionalidad.close();
    }
    console.log(datos);
    createPersona(datos);
    console.log('Datos recibidos en persona:', datos);
});

ipcMain.on('regresar-capturaOnline', () => {
    if (userWindow) {
        userWindow.close();
    }
    if (nacionalidad) {
        nacionalidad.close();
    }
    createCaptureOnline(dataUpdate);
});

ipcMain.on('regresar-nacionalidad', () => {
    if (persona) {
        persona.close();
    }
    console.log("trato de regresarrrrrrrrr");
    createNacionalidad(datosNacionalidad);
});

ipcMain.on('guardarRegistro', (event,datos) => {
    console.log("Se guardarán en la base de datos: ", datos);
    // if (!db) {
    //     console.error('Database is not initialized.');
    //     return;
    // }

    // const stmt = db.prepare(`
    //     INSERT INTO Registro (nickname, nombre, apellido, password, estado, tipo)
    //     VALUES (?, ?, ?, ?, ?, ?)
    // `);

    // stmt.run(userData.nickname, userData.nombre, userData.apellido, userData.password, userData.estado, userData.tipo, (err) => {
    //     if (err) {
    //         console.error('Error saving user to database:', err);
    //     } else {
    //         console.log('User saved to database successfully.');
    //     }
    //     stmt.finalize();
    // });
});

ipcMain.handle('obtenerPaisesDeDB', async (event) => {
    try {
        if (!db) {
            console.error('Database is not initialized.');
            return;
        }

        const paises = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM Paises', (err, rows) => {
                if (err) {
                    console.error('Error al obtener los paises de la base de datos:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        return paises;
    } catch (err) {
        console.error('Error durante la obtención de paises:', err);
        throw err;
    }
});