import type { ReactNode } from 'react';

export interface LanguageDropdownProps {
    selectedLanguage?: Language;
    onLanguageChange: (language: Language) => void;
    culture?: CultureInfo | string;
    languageInformation?: LanguageInformation[];
    getLanguageInformation?: (cultureInfo: CultureInfo) => Promise<LanguageInformation[]>;
    Label?: string;
    classNameLabel?: string;
    classNameSelect?: string;
    enableVirtualScrolling?: boolean;
    virtualScrollThreshold?: number;
    enableSearch?: boolean;
    showLoadingIndicator?: boolean;
    customLoadingIndicator?: ReactNode;
    loadingText?: string;
}
// Type for a single element from languages JSON file
export type LanguageInformation = {
    code: Language;
    name: string;
    group?: string;
};
export interface CountryDropdownProps {
    selectedCountry?: string;
    onCountryChange: (country: string) => void;
    culture?: CultureInfo | string;
    countryInformation?: CountryInformation[];
    getCountryInformation?: GetCountryInformation;
    Label?: string;
    classNameLabel?: string;
    classNameSelect?: string;
    enableVirtualScrolling?: boolean;
    virtualScrollThreshold?: number;
    enableSearch?: boolean;
    showLoadingIndicator?: boolean;
    customLoadingIndicator?: ReactNode;
    loadingText?: string;
}
// Type for a single element from countries JSON file
export type CountryInformation = {
    code: Country;
    name: string;
    group?: string;
};
// ISO 3166-1 alpha-2 country codes
export type Country =
    | 'AF' | 'AX' | 'AL' | 'DZ' | 'AS' | 'AD' | 'AO' | 'AI' | 'AQ' | 'AG' | 'AR' | 'AM' | 'AW' | 'AU' | 'AT' | 'AZ'
    | 'BS' | 'BH' | 'BD' | 'BB' | 'BY' | 'BE' | 'BZ' | 'BJ' | 'BM' | 'BT' | 'BO' | 'BQ' | 'BA' | 'BW' | 'BV' | 'BR'
    | 'IO' | 'BN' | 'BG' | 'BF' | 'BI' | 'KH' | 'CM' | 'CA' | 'CV' | 'KY' | 'CF' | 'TD' | 'CL' | 'CN' | 'CX' | 'CC'
    | 'CO' | 'KM' | 'CG' | 'CD' | 'CK' | 'CR' | 'CI' | 'HR' | 'CU' | 'CW' | 'CY' | 'CZ' | 'DK' | 'DJ' | 'DM' | 'DO'
    | 'EC' | 'EG' | 'SV' | 'GQ' | 'ER' | 'EE' | 'ET' | 'FK' | 'FO' | 'FJ' | 'FI' | 'FR' | 'GF' | 'PF' | 'TF' | 'GA'
    | 'GM' | 'GE' | 'DE' | 'GH' | 'GI' | 'GR' | 'GL' | 'GD' | 'GP' | 'GU' | 'GT' | 'GG' | 'GN' | 'GW' | 'GY' | 'HT'
    | 'HM' | 'VA' | 'HN' | 'HK' | 'HU' | 'IS' | 'IN' | 'ID' | 'IR' | 'IQ' | 'IE' | 'IM' | 'IL' | 'IT' | 'JM' | 'JP'
    | 'JE' | 'JO' | 'KZ' | 'KE' | 'KI' | 'KP' | 'KR' | 'KW' | 'KG' | 'LA' | 'LV' | 'LB' | 'LS' | 'LR' | 'LY' | 'LI'
    | 'LT' | 'LU' | 'MO' | 'MK' | 'MG' | 'MW' | 'MY' | 'MV' | 'ML' | 'MT' | 'MH' | 'MQ' | 'MR' | 'MU' | 'YT' | 'MX'
    | 'FM' | 'MD' | 'MC' | 'MN' | 'ME' | 'MS' | 'MA' | 'MZ' | 'MM' | 'NA' | 'NR' | 'NP' | 'NL' | 'NC' | 'NZ' | 'NI'
    | 'NE' | 'NG' | 'NU' | 'NF' | 'MP' | 'NO' | 'OM' | 'PK' | 'PW' | 'PS' | 'PA' | 'PG' | 'PY' | 'PE' | 'PH' | 'PN'
    | 'PL' | 'PT' | 'PR' | 'QA' | 'RE' | 'RO' | 'RU' | 'RW' | 'BL' | 'SH' | 'KN' | 'LC' | 'MF' | 'PM' | 'VC' | 'WS'
    | 'SM' | 'ST' | 'SA' | 'SN' | 'RS' | 'SC' | 'SL' | 'SG' | 'SX' | 'SK' | 'SI' | 'SB' | 'SO' | 'ZA' | 'GS' | 'SS'
    | 'ES' | 'LK' | 'SD' | 'SR' | 'SJ' | 'SE' | 'CH' | 'SY' | 'TW' | 'TJ' | 'TZ' | 'TH' | 'TL' | 'TG' | 'TK' | 'TO'
    | 'TT' | 'TN' | 'TR' | 'TM' | 'TC' | 'TV' | 'UG' | 'UA' | 'AE' | 'GB' | 'UM' | 'US' | 'UY' | 'UZ' | 'VU' | 'VE'
    | 'VN' | 'VG' | 'VI' | 'WF' | 'EH' | 'YE' | 'ZM' | 'ZW';
// ISO 639-1 language codes
export type Language =
    | 'ab' | 'aa' | 'af' | 'ak' | 'sq' | 'am' | 'ar' | 'an' | 'hy' | 'as' | 'av' | 'ae' | 'ay' | 'az'
    | 'ba' | 'bm' | 'eu' | 'be' | 'bn' | 'bh' | 'bi' | 'bs' | 'br' | 'bg' | 'my' | 'ca' | 'ch' | 'ce'
    | 'ny' | 'zh' | 'cv' | 'kw' | 'co' | 'cr' | 'hr' | 'cs' | 'da' | 'dv' | 'nl' | 'dz' | 'en' | 'eo'
    | 'et' | 'ee' | 'fo' | 'fj' | 'fi' | 'fr' | 'ff' | 'gd' | 'gl' | 'lg' | 'ka' | 'de' | 'el' | 'kl'
    | 'gn' | 'gu' | 'ht' | 'ha' | 'he' | 'hz' | 'hi' | 'ho' | 'hu' | 'is' | 'io' | 'ig' | 'id' | 'ia'
    | 'ie' | 'iu' | 'ik' | 'ga' | 'it' | 'ja' | 'jv' | 'kn' | 'kr' | 'ks' | 'kk' | 'km' | 'ki' | 'rw'
    | 'ky' | 'kv' | 'kg' | 'ko' | 'kj' | 'ku' | 'lo' | 'la' | 'lv' | 'li' | 'ln' | 'lt' | 'lu' | 'lb'
    | 'mk' | 'mg' | 'ms' | 'ml' | 'mt' | 'gv' | 'mi' | 'mr' | 'mh' | 'mn' | 'na' | 'nv' | 'nd' | 'ne'
    | 'ng' | 'nb' | 'nn' | 'no' | 'ii' | 'nr' | 'oc' | 'oj' | 'cu' | 'om' | 'or' | 'os' | 'pa' | 'pi'
    | 'fa' | 'pl' | 'ps' | 'pt' | 'qu' | 'rm' | 'rn' | 'ro' | 'ru' | 'sa' | 'sc' | 'sd' | 'se' | 'sm'
    | 'sg' | 'sr' | 'sn' | 'si' | 'sk' | 'sl' | 'so' | 'st' | 'es' | 'su' | 'sw' | 'ss' | 'sv' | 'ta'
    | 'te' | 'tg' | 'th' | 'ti' | 'bo' | 'tk' | 'tl' | 'tn' | 'to' | 'tr' | 'ts' | 'tt' | 'tw' | 'ty'
    | 'ug' | 'uk' | 'ur' | 'uz' | 've' | 'vi' | 'vo' | 'wa' | 'cy' | 'wo' | 'xh' | 'yi' | 'yo' | 'za' | 'zu';
export type Culture = `${Language}-${Country}`; // e.g., "en-US", "fr-CA"
export class CultureInfo{
    /**
     * Validates if a string is a valid Culture type (e.g., 'en-US').
     */
    public static isValidCulture(value: string): value is Culture {
        const parts = value.split('-');
        if (parts.length !== 2) return false;
        const [lang, country] = parts;
        // @ts-ignore: runtime check, not type check
        const langObj = {
            ab:1, aa:1, af:1, ak:1, sq:1, am:1, ar:1, an:1, hy:1, as:1, av:1, ae:1, ay:1, az:1,
            ba:1, bm:1, eu:1, be:1, bn:1, bh:1, bi:1, bs:1, br:1, bg:1, my:1, ca:1, ch:1, ce:1,
            ny:1, zh:1, cv:1, kw:1, co:1, cr:1, hr:1, cs:1, da:1, dv:1, nl:1, dz:1, en:1, eo:1,
            et:1, ee:1, fo:1, fj:1, fi:1, fr:1, ff:1, gd:1, gl:1, lg:1, ka:1, de:1, el:1, kl:1,
            gn:1, gu:1, ht:1, ha:1, he:1, hz:1, hi:1, ho:1, hu:1, is:1, io:1, ig:1, id:1, ia:1,
            ie:1, iu:1, ik:1, ga:1, it:1, ja:1, jv:1, kn:1, kr:1, ks:1, kk:1, km:1, ki:1, rw:1,
            ky:1, kv:1, kg:1, ko:1, kj:1, ku:1, lo:1, la:1, lv:1, li:1, ln:1, lt:1, lu:1, lb:1,
            mk:1, mg:1, ms:1, ml:1, mt:1, gv:1, mi:1, mr:1, mh:1, mn:1, na:1, nv:1, nd:1, ne:1,
            ng:1, nb:1, nn:1, no:1, ii:1, nr:1, oc:1, oj:1, cu:1, om:1, or:1, os:1, pa:1, pi:1,
            fa:1, pl:1, ps:1, pt:1, qu:1, rm:1, rn:1, ro:1, ru:1, sa:1, sc:1, sd:1, se:1, sm:1,
            sg:1, sr:1, sn:1, si:1, sk:1, sl:1, so:1, st:1, es:1, su:1, sw:1, ss:1, sv:1, ta:1,
            te:1, tg:1, th:1, ti:1, bo:1, tk:1, tl:1, tn:1, to:1, tr:1, ts:1, tt:1, tw:1, ty:1,
            ug:1, uk:1, ur:1, uz:1, ve:1, vi:1, vo:1, wa:1, cy:1, wo:1, xh:1, yi:1, yo:1, za:1, zu:1
        };
        const countryObj = {
            AF:1, AX:1, AL:1, DZ:1, AS:1, AD:1, AO:1, AI:1, AQ:1, AG:1, AR:1, AM:1, AW:1, AU:1, AT:1, AZ:1,
            BS:1, BH:1, BD:1, BB:1, BY:1, BE:1, BZ:1, BJ:1, BM:1, BT:1, BO:1, BQ:1, BA:1, BW:1, BV:1, BR:1,
            IO:1, BN:1, BG:1, BF:1, BI:1, KH:1, CM:1, CA:1, CV:1, KY:1, CF:1, TD:1, CL:1, CN:1, CX:1, CC:1,
            CO:1, KM:1, CG:1, CD:1, CK:1, CR:1, CI:1, HR:1, CU:1, CW:1, CY:1, CZ:1, DK:1, DJ:1, DM:1, DO:1,
            EC:1, EG:1, SV:1, GQ:1, ER:1, EE:1, ET:1, FK:1, FO:1, FJ:1, FI:1, FR:1, GF:1, PF:1, TF:1, GA:1,
            GM:1, GE:1, DE:1, GH:1, GI:1, GR:1, GL:1, GD:1, GP:1, GU:1, GT:1, GG:1, GN:1, GW:1, GY:1, HT:1,
            HM:1, VA:1, HN:1, HK:1, HU:1, IS:1, IN:1, ID:1, IR:1, IQ:1, IE:1, IM:1, IL:1, IT:1, JM:1, JP:1,
            JE:1, JO:1, KZ:1, KE:1, KI:1, KP:1, KR:1, KW:1, KG:1, LA:1, LV:1, LB:1, LS:1, LR:1, LY:1, LI:1,
            LT:1, LU:1, MO:1, MK:1, MG:1, MW:1, MY:1, MV:1, ML:1, MT:1, MH:1, MQ:1, MR:1, MU:1, YT:1, MX:1,
            FM:1, MD:1, MC:1, MN:1, ME:1, MS:1, MA:1, MZ:1, MM:1, NA:1, NR:1, NP:1, NL:1, NC:1, NZ:1, NI:1,
            NE:1, NG:1, NU:1, NF:1, MP:1, NO:1, OM:1, PK:1, PW:1, PS:1, PA:1, PG:1, PY:1, PE:1, PH:1, PN:1,
            PL:1, PT:1, PR:1, QA:1, RE:1, RO:1, RU:1, RW:1, BL:1, SH:1, KN:1, LC:1, MF:1, PM:1, VC:1, WS:1,
            SM:1, ST:1, SA:1, SN:1, RS:1, SC:1, SL:1, SG:1, SX:1, SK:1, SI:1, SB:1, SO:1, ZA:1, GS:1, SS:1,
            ES:1, LK:1, SD:1, SR:1, SJ:1, SE:1, CH:1, SY:1, TW:1, TJ:1, TZ:1, TH:1, TL:1, TG:1, TK:1, TO:1,
            TT:1, TN:1, TR:1, TM:1, TC:1, TV:1, UG:1, UA:1, AE:1, GB:1, UM:1, US:1, UY:1, UZ:1, VU:1, VE:1,
            VN:1, VG:1, VI:1, WF:1, EH:1, YE:1, ZM:1, ZW:1
        };
        const validLang = Object.prototype.hasOwnProperty.call(langObj, lang);
        const validCountry = Object.prototype.hasOwnProperty.call(countryObj, country);
        return validLang && validCountry;
    }
    constructor(public cultureInitializer: Culture) {        
        const [lang, country] = cultureInitializer.split('-');
        this._language = lang as Language;
        this._country = (country ? country : 'US') as Country;
        this._culture = `${this._language}-${this._country}`;
        if (!CultureInfo.isValidCulture(this._culture)) {
            throw new Error(`Invalid culture: ${cultureInitializer}`);
        }
    }
    private _culture: Culture;
    private _language: Language;
    private _country: Country;

    public get Culture(): Culture {
        return this._culture;
    }
    public get Language(): Language {
        return this._language;
    }
    public get Country(): Country {
        return this._country;
    }
}

export interface StateDropdownProps {
    getStateProvinceInformation?: GetStateProvinceInformation; 
    selectedState?: string;
    onStateChange: (state: string) => void;
    country: Country;
    culture?: CultureInfo | Culture;
    stateProvinceInformation?: StateProvinceInformation[];
    Label?: string;
    classNameLabel?: string;
    classNameSelect?: string;
    enableVirtualScrolling?: boolean;
    virtualScrollThreshold?: number;
    enableSearch?: boolean;
    showLoadingIndicator?: boolean;
    customLoadingIndicator?: ReactNode;
    loadingText?: string;
}

export interface GetCountryInformation {
  (cultureInfo: CultureInfo): Promise<CountryInformation[]>;
}

export type StateProvinceInformation = {
  code: string;
  name: string;
  group?: string;
}

export interface GetStateProvinceInformation {
  (cultureInfo: CultureInfo): Promise<StateProvinceInformation[]>;
}
