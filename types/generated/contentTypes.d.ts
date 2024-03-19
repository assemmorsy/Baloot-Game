import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    singularName: 'release';
    pluralName: 'releases';
    displayName: 'Release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    timezone: Attribute.String;
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    singularName: 'release-action';
    pluralName: 'release-actions';
    displayName: 'Release Action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    contentType: Attribute.String & Attribute.Required;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          min: 1;
          max: 50;
        },
        number
      >;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    qydha_Id: Attribute.String;
    phone: Attribute.String;
    avatar_url: Attribute.String;
    name: Attribute.String;
    match_estimations: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'api::match-estimation.match-estimation'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiAnalystAnalyst extends Schema.CollectionType {
  collectionName: 'analysts';
  info: {
    singularName: 'analyst';
    pluralName: 'analysts';
    displayName: '\u0627\u0644\u0645\u062D\u0644\u0644';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    image: Attribute.Media & Attribute.Required;
    studios: Attribute.Relation<
      'api::analyst.analyst',
      'manyToMany',
      'api::studio.studio'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::analyst.analyst',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::analyst.analyst',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiApplyToJobRequestApplyToJobRequest
  extends Schema.CollectionType {
  collectionName: 'apply_to_job_requests';
  info: {
    singularName: 'apply-to-job-request';
    pluralName: 'apply-to-job-requests';
    displayName: '\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0644\u0644\u0648\u0638\u0627\u0626\u0641';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    email: Attribute.Email & Attribute.Required;
    phone: Attribute.String & Attribute.Required;
    address: Attribute.String & Attribute.Required;
    aboutMe: Attribute.RichText;
    CV: Attribute.Media & Attribute.Required;
    job: Attribute.Relation<
      'api::apply-to-job-request.apply-to-job-request',
      'manyToOne',
      'api::job.job'
    >;
    date: Attribute.DateTime & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::apply-to-job-request.apply-to-job-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::apply-to-job-request.apply-to-job-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiBlogBlog extends Schema.CollectionType {
  collectionName: 'blogs';
  info: {
    singularName: 'blog';
    pluralName: 'blogs';
    displayName: '\u0627\u0644\u0627\u062E\u0628\u0627\u0631';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String & Attribute.Required;
    description: Attribute.String & Attribute.Required;
    details: Attribute.RichText & Attribute.Required;
    image: Attribute.Media & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::blog.blog', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::blog.blog', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiChampionJoinRequestChampionJoinRequest
  extends Schema.CollectionType {
  collectionName: 'champion_join_requests';
  info: {
    singularName: 'champion-join-request';
    pluralName: 'champion-join-requests';
    displayName: '\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0644\u0644\u0628\u0637\u0648\u0644\u0627\u062A';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    email: Attribute.Email & Attribute.Required;
    teamName: Attribute.String & Attribute.Required;
    phone: Attribute.String;
    fpName: Attribute.String & Attribute.Required;
    fpCity: Attribute.String & Attribute.Required;
    fpAge: Attribute.String & Attribute.Required;
    fpExperience: Attribute.Decimal & Attribute.Required;
    spName: Attribute.String & Attribute.Required;
    spCity: Attribute.String & Attribute.Required;
    spAge: Attribute.String & Attribute.Required;
    spExperience: Attribute.Decimal & Attribute.Required;
    IsPlayedBefore: Attribute.String & Attribute.Required;
    date: Attribute.DateTime;
    whatapp_link: Attribute.String;
    fpBirthDate: Attribute.Date & Attribute.Required;
    spBirthDate: Attribute.Date & Attribute.Required;
    followers_champion: Attribute.Relation<
      'api::champion-join-request.champion-join-request',
      'manyToOne',
      'api::followers-champion.followers-champion'
    >;
    fpPhone: Attribute.String & Attribute.Required;
    spPhone: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::champion-join-request.champion-join-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::champion-join-request.champion-join-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiClientsImageClientsImage extends Schema.SingleType {
  collectionName: 'clients_images';
  info: {
    singularName: 'clients-image';
    pluralName: 'clients-images';
    displayName: 'clientsImages';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    images: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::clients-image.clients-image',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::clients-image.clients-image',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCoachCoach extends Schema.CollectionType {
  collectionName: 'coaches';
  info: {
    singularName: 'coach';
    pluralName: 'coaches';
    displayName: '\u0627\u0644\u0645\u062F\u0631\u0628\u064A\u0646';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    image: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::coach.coach',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::coach.coach',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCoachesTransferCoachesTransfer
  extends Schema.CollectionType {
  collectionName: 'coaches_transfers';
  info: {
    singularName: 'coaches-transfer';
    pluralName: 'coaches-transfers';
    displayName: '\u0627\u062A\u0642\u0627\u0644\u0627\u062A \u0627\u0644\u0645\u062F\u0631\u0628\u064A\u0646';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    transfered_at: Attribute.Date & Attribute.Required;
    from_team: Attribute.Relation<
      'api::coaches-transfer.coaches-transfer',
      'manyToOne',
      'api::team.team'
    >;
    to_team: Attribute.Relation<
      'api::coaches-transfer.coaches-transfer',
      'manyToOne',
      'api::team.team'
    >;
    coach: Attribute.Relation<
      'api::coaches-transfer.coaches-transfer',
      'oneToOne',
      'api::coach.coach'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::coaches-transfer.coaches-transfer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::coaches-transfer.coaches-transfer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiContactUsMessageContactUsMessage
  extends Schema.CollectionType {
  collectionName: 'contact_us_messages';
  info: {
    singularName: 'contact-us-message';
    pluralName: 'contact-us-messages';
    displayName: '\u0631\u0633\u0627\u0626\u0644 \u0645\u0648\u0642\u0639 \u0633\u0627\u0645';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    message: Attribute.Text & Attribute.Required;
    email: Attribute.Email & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    date: Attribute.DateTime & Attribute.Required;
    type: Attribute.String & Attribute.Required;
    handled: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::contact-us-message.contact-us-message',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::contact-us-message.contact-us-message',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiFollowersChampionFollowersChampion
  extends Schema.CollectionType {
  collectionName: 'followers_champions';
  info: {
    singularName: 'followers-champion';
    pluralName: 'followers-champions';
    displayName: 'FollowersChampions';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    descriptions: Attribute.Text & Attribute.Required;
    IsApplyOpen: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    Commitments: Attribute.RichText;
    tlbat_alandmam_llbtwlats: Attribute.Relation<
      'api::followers-champion.followers-champion',
      'oneToMany',
      'api::champion-join-request.champion-join-request'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::followers-champion.followers-champion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::followers-champion.followers-champion',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiHomePageChampionshipHomePageChampionship
  extends Schema.SingleType {
  collectionName: 'home_page_championships';
  info: {
    singularName: 'home-page-championship';
    pluralName: 'home-page-championships';
    displayName: '\u0627\u062E\u062A\u0631 \u0627\u0644\u0628\u0637\u0648\u0644\u0629 \u0644\u0639\u0631\u0636 \u0645\u0628\u0627\u0631\u064A\u0627\u062A\u0647\u0627 \u0641\u064A \u0627\u0644\u0635\u0641\u062E\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    championship: Attribute.Relation<
      'api::home-page-championship.home-page-championship',
      'oneToOne',
      'api::league.league'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::home-page-championship.home-page-championship',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::home-page-championship.home-page-championship',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiJobJob extends Schema.CollectionType {
  collectionName: 'jobs';
  info: {
    singularName: 'job';
    pluralName: 'jobs';
    displayName: '\u0627\u0644\u0648\u0638\u0627\u0626\u0641';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    jobTitle: Attribute.String & Attribute.Required;
    jobDescription: Attribute.RichText & Attribute.Required;
    responsibilities: Attribute.RichText & Attribute.Required;
    isApplyingOpen: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    apply_to_job_requests: Attribute.Relation<
      'api::job.job',
      'oneToMany',
      'api::apply-to-job-request.apply-to-job-request'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::job.job', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::job.job', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiJoinAsRefereeRequestJoinAsRefereeRequest
  extends Schema.CollectionType {
  collectionName: 'join_as_referee_requests';
  info: {
    singularName: 'join-as-referee-request';
    pluralName: 'join-as-referee-requests';
    displayName: '\u0637\u0644\u0628\u0627\u062A \u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645 \u0643\u062D\u0643\u0627\u0645';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    phone: Attribute.String & Attribute.Required;
    address: Attribute.String & Attribute.Required;
    email: Attribute.Email & Attribute.Required;
    birthDate: Attribute.Date & Attribute.Required;
    experience: Attribute.Decimal & Attribute.Required;
    sentAt: Attribute.Date & Attribute.Required;
    IsJudgedBefore: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::join-as-referee-request.join-as-referee-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::join-as-referee-request.join-as-referee-request',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLeagueLeague extends Schema.CollectionType {
  collectionName: 'leagues';
  info: {
    singularName: 'league';
    pluralName: 'leagues';
    displayName: '\u0627\u0644\u0628\u0637\u0648\u0644\u0629';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    image: Attribute.Media;
    league_table: Attribute.Relation<
      'api::league.league',
      'oneToOne',
      'api::league-table.league-table'
    >;
    laws: Attribute.RichText;
    startAt: Attribute.Date;
    endAt: Attribute.Date;
    description: Attribute.Text;
    type: Attribute.Enumeration<['league', 'cup', 'super', 'hezam']> &
      Attribute.Required &
      Attribute.DefaultTo<'league'>;
    state: Attribute.Enumeration<['upcoming', 'live', 'done']> &
      Attribute.Required &
      Attribute.DefaultTo<'upcoming'>;
    champion: Attribute.Relation<
      'api::league.league',
      'manyToOne',
      'api::team.team'
    >;
    ad_image: Attribute.Media;
    almbarats: Attribute.Relation<
      'api::league.league',
      'oneToMany',
      'api::match.match'
    >;
    astwdyws: Attribute.Relation<
      'api::league.league',
      'oneToMany',
      'api::studio.studio'
    >;
    team: Attribute.Relation<
      'api::league.league',
      'manyToMany',
      'api::team.team'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::league.league',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::league.league',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiLeagueTableLeagueTable extends Schema.CollectionType {
  collectionName: 'league_tables';
  info: {
    singularName: 'league-table';
    pluralName: 'league-tables';
    displayName: '\u062C\u062F\u0648\u0644 \u062A\u0631\u062A\u064A\u0628 \u0627\u0644\u062F\u0648\u0631\u064A';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    league: Attribute.Relation<
      'api::league-table.league-table',
      'oneToOne',
      'api::league.league'
    >;
    data: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::league-table.league-table',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::league-table.league-table',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMatchMatch extends Schema.CollectionType {
  collectionName: 'matches';
  info: {
    singularName: 'match';
    pluralName: 'matches';
    displayName: '\u0627\u0644\u0645\u0628\u0627\u0631\u0627\u0629';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    referees: Attribute.Relation<
      'api::match.match',
      'oneToMany',
      'api::referee.referee'
    >;
    state: Attribute.Enumeration<
      [
        '\u0644\u0645 \u062A\u0628\u062F\u0623 \u0628\u0639\u062F',
        '\u0645\u0628\u0627\u0634\u0631',
        '\u0627\u0646\u062A\u0647\u062A'
      ]
    > &
      Attribute.DefaultTo<'\u0644\u0645 \u062A\u0628\u062F\u0623 \u0628\u0639\u062F'>;
    start_at: Attribute.DateTime & Attribute.Required;
    albtwlt: Attribute.Relation<
      'api::match.match',
      'manyToOne',
      'api::league.league'
    >;
    team_1: Attribute.Relation<
      'api::match.match',
      'oneToOne',
      'api::team.team'
    >;
    team_2: Attribute.Relation<
      'api::match.match',
      'oneToOne',
      'api::team.team'
    >;
    team1_score: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_score: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_akak: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_akak: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_akalat: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_akalat: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_moshtary_sun: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_moshtary_sun: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_moshtary_hakam: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_moshtary_hakam: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_moshtrayat_nagha: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_moshtrayat_nagha: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_moshtrayat_khasera: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_moshtrayat_khasera: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_sra: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_sra: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_baloot: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_baloot: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_khamsin: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_khamsin: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_100: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_100: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_400: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_400: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_kababit_sun_count: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_kababit_sun_count: Attribute.Integer & Attribute.DefaultTo<0>;
    team1_kababit_hakam_count: Attribute.Integer & Attribute.DefaultTo<0>;
    team2_kababit_hakam_count: Attribute.Integer & Attribute.DefaultTo<0>;
    url: Attribute.String;
    team1_abnat: Attribute.Decimal & Attribute.DefaultTo<0>;
    team2_abnat: Attribute.Decimal & Attribute.DefaultTo<0>;
    numberOfRounds: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 3;
        },
        number
      > &
      Attribute.DefaultTo<0>;
    team1_players: Attribute.Relation<
      'api::match.match',
      'oneToMany',
      'api::player.player'
    >;
    team2_players: Attribute.Relation<
      'api::match.match',
      'oneToMany',
      'api::player.player'
    >;
    tournment_name: Attribute.String;
    type: Attribute.Enumeration<['official', 'friendly']> &
      Attribute.Required &
      Attribute.DefaultTo<'official'>;
    team_1_coach: Attribute.Relation<
      'api::match.match',
      'oneToOne',
      'api::coach.coach'
    >;
    team_2_coach: Attribute.Relation<
      'api::match.match',
      'oneToOne',
      'api::coach.coach'
    >;
    match_estimations: Attribute.Relation<
      'api::match.match',
      'oneToMany',
      'api::match-estimation.match-estimation'
    >;
    start_estimations: Attribute.DateTime;
    end_estimations: Attribute.DateTime;
    count_of_red_cards: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    best_player: Attribute.Relation<
      'api::match.match',
      'manyToOne',
      'api::player.player'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::match.match',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::match.match',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiMatchEstimationMatchEstimation
  extends Schema.CollectionType {
  collectionName: 'match_estimations';
  info: {
    singularName: 'match-estimation';
    pluralName: 'match-estimations';
    displayName: 'MatchEstimation';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    countOf400: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    countOfKaboots: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    countOfRedCards: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    loserScore: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
          max: 1;
        },
        number
      >;
    winner_team: Attribute.Relation<
      'api::match-estimation.match-estimation',
      'manyToOne',
      'api::team.team'
    >;
    best_player: Attribute.Relation<
      'api::match-estimation.match-estimation',
      'manyToOne',
      'api::player.player'
    >;
    user: Attribute.Relation<
      'api::match-estimation.match-estimation',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    match: Attribute.Relation<
      'api::match-estimation.match-estimation',
      'manyToOne',
      'api::match.match'
    >;
    estimation_score: Attribute.Integer;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::match-estimation.match-estimation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::match-estimation.match-estimation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPlayerPlayer extends Schema.CollectionType {
  collectionName: 'players';
  info: {
    singularName: 'player';
    pluralName: 'players';
    displayName: '\u0627\u0644\u0644\u0627\u0639\u0628';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 2;
      }>;
    image: Attribute.Media;
    player_transfers: Attribute.Relation<
      'api::player.player',
      'oneToMany',
      'api::player-transfer.player-transfer'
    >;
    twitter_link: Attribute.String;
    snap_link: Attribute.String;
    tiktok_link: Attribute.String;
    team_captains: Attribute.Relation<
      'api::player.player',
      'oneToMany',
      'api::team-captain.team-captain'
    >;
    youtube_link: Attribute.String;
    best_player_at_estimations: Attribute.Relation<
      'api::player.player',
      'oneToMany',
      'api::match-estimation.match-estimation'
    >;
    best_player_at: Attribute.Relation<
      'api::player.player',
      'oneToMany',
      'api::match.match'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::player.player',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::player.player',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiPlayerTransferPlayerTransfer extends Schema.CollectionType {
  collectionName: 'player_transfers';
  info: {
    singularName: 'player-transfer';
    pluralName: 'player-transfers';
    displayName: '\u0627\u0646\u062A\u0642\u0627\u0644\u0627\u062A \u0627\u0644\u0644\u0627\u0639\u0628\u064A\u0646';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    transfered_at: Attribute.Date & Attribute.Required;
    player: Attribute.Relation<
      'api::player-transfer.player-transfer',
      'manyToOne',
      'api::player.player'
    >;
    from_team: Attribute.Relation<
      'api::player-transfer.player-transfer',
      'manyToOne',
      'api::team.team'
    >;
    to_team: Attribute.Relation<
      'api::player-transfer.player-transfer',
      'manyToOne',
      'api::team.team'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::player-transfer.player-transfer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::player-transfer.player-transfer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiRefereeReferee extends Schema.CollectionType {
  collectionName: 'referees';
  info: {
    singularName: 'referee';
    pluralName: 'referees';
    displayName: '\u0627\u0644\u062D\u0643\u0645';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    image: Attribute.Media;
    start_refereeing_at: Attribute.Date & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::referee.referee',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::referee.referee',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiStudioStudio extends Schema.CollectionType {
  collectionName: 'studios';
  info: {
    singularName: 'studio';
    pluralName: 'studios';
    displayName: '\u0627\u0633\u062A\u0648\u062F\u064A\u0648';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    start_at: Attribute.DateTime;
    name: Attribute.String & Attribute.Required;
    url: Attribute.String;
    analysts: Attribute.Relation<
      'api::studio.studio',
      'manyToMany',
      'api::analyst.analyst'
    >;
    albtwlt: Attribute.Relation<
      'api::studio.studio',
      'manyToOne',
      'api::league.league'
    >;
    tournment_name: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::studio.studio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::studio.studio',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiTeamTeam extends Schema.CollectionType {
  collectionName: 'teams';
  info: {
    singularName: 'team';
    pluralName: 'teams';
    displayName: '\u0627\u0644\u0641\u0631\u064A\u0642';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    logo: Attribute.Media;
    winnerAt: Attribute.Relation<
      'api::team.team',
      'oneToMany',
      'api::league.league'
    >;
    going_players: Attribute.Relation<
      'api::team.team',
      'oneToMany',
      'api::player-transfer.player-transfer'
    >;
    coming_players: Attribute.Relation<
      'api::team.team',
      'oneToMany',
      'api::player-transfer.player-transfer'
    >;
    founded_in: Attribute.Date & Attribute.Required;
    team_captains: Attribute.Relation<
      'api::team.team',
      'oneToMany',
      'api::team-captain.team-captain'
    >;
    showInAllTeams: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    champ: Attribute.Relation<
      'api::team.team',
      'manyToMany',
      'api::league.league'
    >;
    going_coaches: Attribute.Relation<
      'api::team.team',
      'oneToMany',
      'api::coaches-transfer.coaches-transfer'
    >;
    coming_coaches: Attribute.Relation<
      'api::team.team',
      'oneToMany',
      'api::coaches-transfer.coaches-transfer'
    >;
    winner_at_estimations: Attribute.Relation<
      'api::team.team',
      'oneToMany',
      'api::match-estimation.match-estimation'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::team.team', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'api::team.team', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface ApiTeamCaptainTeamCaptain extends Schema.CollectionType {
  collectionName: 'team_captains';
  info: {
    singularName: 'team-captain';
    pluralName: 'team-captains';
    displayName: '\u0643\u0627\u0628\u062A\u0646 \u0627\u0644\u0641\u0631\u064A\u0642';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    becameCaptianAt: Attribute.Date;
    team: Attribute.Relation<
      'api::team-captain.team-captain',
      'manyToOne',
      'api::team.team'
    >;
    player: Attribute.Relation<
      'api::team-captain.team-captain',
      'manyToOne',
      'api::player.player'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::team-captain.team-captain',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::team-captain.team-captain',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiWebsiteVisitsCounterWebsiteVisitsCounter
  extends Schema.SingleType {
  collectionName: 'website_visits_counters';
  info: {
    singularName: 'website-visits-counter';
    pluralName: 'website-visits-counters';
    displayName: 'website_visits_counter';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    counter: Attribute.BigInteger &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: '0';
        },
        string
      > &
      Attribute.DefaultTo<'0'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::website-visits-counter.website-visits-counter',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'api::website-visits-counter.website-visits-counter',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'api::analyst.analyst': ApiAnalystAnalyst;
      'api::apply-to-job-request.apply-to-job-request': ApiApplyToJobRequestApplyToJobRequest;
      'api::blog.blog': ApiBlogBlog;
      'api::champion-join-request.champion-join-request': ApiChampionJoinRequestChampionJoinRequest;
      'api::clients-image.clients-image': ApiClientsImageClientsImage;
      'api::coach.coach': ApiCoachCoach;
      'api::coaches-transfer.coaches-transfer': ApiCoachesTransferCoachesTransfer;
      'api::contact-us-message.contact-us-message': ApiContactUsMessageContactUsMessage;
      'api::followers-champion.followers-champion': ApiFollowersChampionFollowersChampion;
      'api::home-page-championship.home-page-championship': ApiHomePageChampionshipHomePageChampionship;
      'api::job.job': ApiJobJob;
      'api::join-as-referee-request.join-as-referee-request': ApiJoinAsRefereeRequestJoinAsRefereeRequest;
      'api::league.league': ApiLeagueLeague;
      'api::league-table.league-table': ApiLeagueTableLeagueTable;
      'api::match.match': ApiMatchMatch;
      'api::match-estimation.match-estimation': ApiMatchEstimationMatchEstimation;
      'api::player.player': ApiPlayerPlayer;
      'api::player-transfer.player-transfer': ApiPlayerTransferPlayerTransfer;
      'api::referee.referee': ApiRefereeReferee;
      'api::studio.studio': ApiStudioStudio;
      'api::team.team': ApiTeamTeam;
      'api::team-captain.team-captain': ApiTeamCaptainTeamCaptain;
      'api::website-visits-counter.website-visits-counter': ApiWebsiteVisitsCounterWebsiteVisitsCounter;
    }
  }
}
