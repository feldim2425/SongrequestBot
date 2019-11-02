import { CheckOptions } from "../utils/objtypecheck";
import _ from 'lodash';
import { DEFAULT_ECDH_CURVE } from 'tls';

const CHECK_CONFIG : CheckOptions = {
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
                    'userbame': {
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
                checkfunction: (val) => _.isString(val) && ['native', 'voicechat'].includes(val),
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

export default CHECK_CONFIG