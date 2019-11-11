import {TypeOption } from "~common/utils/objtypecheck";
import _ from 'lodash';
import { DEFAULT_ECDH_CURVE } from 'tls';

const CHECK_CONFIG : TypeOption = {
    subel: {
        'server': {
            subel: {
                'enable_https':{
                    checkfunction: _.isBoolean,
                    defaultVal: false
                },
                'dashboard_sha256': {
                    checkfunction: _.isString,
                    defaultVal: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' // => sha256("admin")
                },
                'https': {
                    subel: {
                        'cert': {
                            checkfunction: (v) => _.isString(v) || _.isNull(v),
                            defaultVal: null
                        },
                        'key': {
                            checkfunction:(v) => _.isString(v) || _.isNull(v),
                            defaultVal: null
                        },
                    }
                }
            }
        },
        'playback_enabled': {
            subel: {
                'spotify': {
                    checkfunction: _.isBoolean,
                    defaultVal: true
                },
                'youtube': {
                    checkfunction: _.isBoolean,
                    defaultVal: true
                }
            }
        },
        'logins': {
            subel: {
                'twitch': {
                    subel: {
                        'username': {
                            checkfunction: _.isString,
                            defaultVal: ''
                        },
                        'oauth': {
                            checkfunction: _.isString,
                            defaultVal: ''
                        },
                        'enabled': {
                            checkfunction: _.isBoolean,
                            defaultVal: false
                        }
                    }
                },
                'discord': {
                    subel: {
                        'token': {
                            checkfunction: _.isString,
                            defaultVal: ''
                        },
                        'enabled': {
                            checkfunction: _.isBoolean,
                            defaultVal: false
                        },
                    }
                }
            }
        },
        'inputs': {
            subel: {
                'twitch_channel': {
                    checkfunction: _.isString,
                    defaultVal: ''
                },
                'discord_channel': {
                    checkfunction: _.isString,
                    defaultVal: ''
                }
            }
        },
        'misc': {
            subel: {
                'playback': {
                    checkfunction: (val) => _.isString(val) && ['native', 'voicechat', 'webstream'].includes(val),
                    defaultVal: 'native'
                },
                'twitch_songAnnounce': {
                    checkfunction: _.isBoolean,
                    defaultVal: true
                },
                'discord_songAnnounce': {
                    checkfunction: _.isBoolean,
                    defaultVal: true
                }
            }
        }
    }
}

export default CHECK_CONFIG