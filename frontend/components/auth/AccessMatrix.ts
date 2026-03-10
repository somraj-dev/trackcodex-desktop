import { SystemRole } from '../../types';

export const isAdmin = (role?: SystemRole | string): boolean => {
    if (!role) return false;
    return ['Super Admin', 'Org Admin', 'Team Admin'].includes(role);
};

export const canEdit = (role?: SystemRole | string): boolean => {
    if (!role) return false;
    return ['Super Admin', 'Org Admin', 'Team Admin', 'Developer'].includes(role);
};

export const isSuperAdmin = (role?: SystemRole | string): boolean => {
    return role === 'Super Admin';
};
