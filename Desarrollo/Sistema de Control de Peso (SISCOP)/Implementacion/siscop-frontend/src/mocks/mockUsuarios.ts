export interface MockUsuario {
    identificador: string;
    usuario: string;
    contrasena: string;
    nombre: string;
    apellidos: string;
    rol: 'Nutricionista' | 'Recepcionista';
}

export const MOCK_USUARIOS: MockUsuario[] = [
    {
        identificador: 'c.silva@hospital.gob.pe',
        usuario: 'nutri',
        contrasena: 'siscop123',
        nombre: 'Carmen',
        apellidos: 'Silva',
        rol: 'Nutricionista'
    },
    {
        identificador: 'l.mendoza@hospital.gob.pe',
        usuario: 'lucia',
        contrasena: 'siscop123',
        nombre: 'Lucía',
        apellidos: 'Mendoza',
        rol: 'Nutricionista'
    },
    {
        identificador: 'r.vargas@hospital.gob.pe',
        usuario: 'recep',
        contrasena: 'siscop123',
        nombre: 'Roberto',
        apellidos: 'Vargas',
        rol: 'Recepcionista'
    },
    {
        identificador: 'm.gomez@hospital.gob.pe',
        usuario: 'maria',
        contrasena: 'siscop123',
        nombre: 'María',
        apellidos: 'Gómez',
        rol: 'Recepcionista'
    }
];
