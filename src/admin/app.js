
import AuthLogo from './extensions/logo.png';
import MenuLogo from './extensions/logo.png';
import favicon from './extensions/favicon.ico';

export default {
    config: {
        // Replace the Strapi logo in auth (login) views
        auth: {
            logo: AuthLogo,
        },
        // Replace the favicon
        head: {
            favicon: favicon,
        },
        // Add a new locale, other than 'en'
        locales: ['ar'],
        // Replace the Strapi logo in the main navigation
        menu: {
            logo: MenuLogo,
        },
        // Override or extend the theme
        theme: {
            // overwrite light theme properties
            light: {
                colors: {
                    primary100: '#f6ecfc',
                    primary200: '#e0c1f4',
                    primary500: '#ac73e6',
                    primary600: '#9736e8',
                    primary700: '#8312d1',
                    danger700: '#ff0000'
                },
            },

            // overwrite dark theme properties
            dark: {
                // ...
            }
        },

        // Disable video tutorials
        tutorials: false,
        // Disable notifications about new Strapi releases
        notifications: { releases: false },
    },

    bootstrap() { },
};
