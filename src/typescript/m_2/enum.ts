


// enum Role {
//     ADMIN = 'admin',
//     USER = 'user', 
//     GUEST = 'guest',
//     EDITOR = 'editor',
//     VIEWER = 'viewer',
// }

// const isAdmin = (role: Role): boolean => {

//     return role === Role.ADMIN;
// }

// isAdmin(Role.ADMIN); // true



const userRole = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest',
    EDITOR: 'editor',
    VIEWER: 'viewer',
} as const;

type TUserRole = typeof userRole[keyof typeof userRole]; 

// type guard
// instance of guard 
// access modifiers 
// getter / setter 
// static in typescritp (not dynamic point same location and hold precise value)
// polimorphism ( same instance give different behavior) )
// abstraction ( define structure with class or interface first -> implementation in child class -> create instance of child class and use it)
// encapsulation ( hide data and provide method to access it)

