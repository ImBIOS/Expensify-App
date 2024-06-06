import {format} from 'date-fns';
import React, {useState} from 'react';
import type {StyleProp, TextStyle} from 'react-native';
import {View} from 'react-native';
import {useOnyx} from 'react-native-onyx';
import Section from '@components/Section';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import useTheme from '@hooks/useTheme';
import useThemeStyles from '@hooks/useThemeStyles';
import Navigation from '@navigation/Navigation';
import ToggleSettingOptionRow from '@pages/workspace/workflows/ToggleSettingsOptionRow';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';

function SubscriptionSettings() {
    const {translate} = useLocalize();
    const styles = useThemeStyles();
    const theme = useTheme();
    const [privateSubscription] = useOnyx(ONYXKEYS.NVP_PRIVATE_SUBSCRIPTION);

    // TODO these default state values will come from API in next phase
    const [autoRenew, setAutoRenew] = useState(true);
    const [autoIncrease, setAutoIncrease] = useState(false);

    const expirationDate = privateSubscription?.endDate ? format(new Date(privateSubscription?.endDate), CONST.DATE.MONTH_DAY_YEAR_ABBR_FORMAT) : null;

    // TODO all actions will be implemented in next phase
    const handleAutoRenewToggle = () => {
        if (!autoRenew) {
            // TODO make API call to enable auto renew here
            setAutoRenew(true);
            return;
        }
        Navigation.navigate(ROUTES.SETTINGS_SUBSCRIPTION_DISABLE_AUTO_RENEW_SURVEY);
    };
    const handleAutoIncreaseToggle = () => {
        // TODO make API call to toggle auto increase here
        setAutoIncrease(!autoIncrease);
    };

    if (privateSubscription?.type === CONST.SUBSCRIPTION.TYPE.PAYPERUSE) {
        return null;
    }

    const customTitleSecondSentenceStyles: StyleProp<TextStyle> = [styles.textNormal, {color: theme.success}];
    const customTitle = (
        <View style={[styles.flexRow, styles.flex1, styles.alignItemsCenter]}>
            <Text style={[styles.mr1, styles.textNormalThemeText]}>{translate('subscription.subscriptionSettings.autoIncrease')}</Text>
            <Text style={customTitleSecondSentenceStyles}>{translate('subscription.subscriptionSettings.saveUpTo')}</Text>
        </View>
    );

    return (
        <Section
            title={translate('subscription.subscriptionSettings.title')}
            titleStyles={styles.textStrong}
            isCentralPane
        >
            <View style={styles.mt5}>
                <ToggleSettingOptionRow
                    title={translate('subscription.subscriptionSettings.autoRenew')}
                    switchAccessibilityLabel={translate('subscription.subscriptionSettings.autoRenew')}
                    onToggle={handleAutoRenewToggle}
                    isActive={privateSubscription?.autoRenew ?? false}
                />
                {!!expirationDate && <Text style={[styles.mutedTextLabel, styles.mt2]}>{translate('subscription.subscriptionSettings.renewsOn', {date: expirationDate})}</Text>}
            </View>
            <View style={styles.mt3}>
                <ToggleSettingOptionRow
                    customTitle={customTitle}
                    switchAccessibilityLabel={translate('subscription.subscriptionSettings.autoRenew')}
                    onToggle={handleAutoIncreaseToggle}
                    isActive={privateSubscription?.addNewUsersAutomatically ?? false}
                />
                <Text style={[styles.mutedTextLabel, styles.mt2]}>{translate('subscription.subscriptionSettings.automaticallyIncrease')}</Text>
            </View>
        </Section>
    );
}

SubscriptionSettings.displayName = 'SubscriptionSettings';

export default SubscriptionSettings;
