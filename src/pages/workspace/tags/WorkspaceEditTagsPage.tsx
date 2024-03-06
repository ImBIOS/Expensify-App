import type {StackScreenProps} from '@react-navigation/stack';
import React, {useMemo, useRef} from 'react';
import {View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import type {OnyxEntry} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import InputWrapper from '@components/Form/InputWrapper';
import type {FormInputErrors, FormOnyxValues} from '@components/Form/types';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import type {AnimatedTextInputRef} from '@components/RNTextInput';
import ScreenWrapper from '@components/ScreenWrapper';
import TextInput from '@components/TextInput';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import * as Policy from '@libs/actions/Policy';
import Navigation from '@libs/Navigation/Navigation';
import * as PolicyUtils from '@libs/PolicyUtils';
import type {SettingsNavigatorParamList} from '@navigation/types';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type SCREENS from '@src/SCREENS';
import INPUT_IDS from '@src/types/form/PolicyTagNameForm';
import type * as OnyxTypes from '@src/types/onyx';

type WorkspaceEditTagsPageOnyxProps = {
    /** Collection of tags attached to a policy */
    policyTags: OnyxEntry<OnyxTypes.PolicyTagList>;
};

type WorkspaceEditTagsPageProps = WorkspaceEditTagsPageOnyxProps & StackScreenProps<SettingsNavigatorParamList, typeof SCREENS.WORKSPACE.TAGS_EDIT>;

function WorkspaceEditTagsPage({route, policyTags}: WorkspaceEditTagsPageProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const taglistName = useMemo(() => PolicyUtils.getTagLists(policyTags)[0].name, [policyTags]);
    const inputRef = useRef<AnimatedTextInputRef>(null);

    const validateTagName = (values: FormOnyxValues<typeof ONYXKEYS.FORMS.POLICY_TAG_NAME_FORM>) => {
        const errors: FormInputErrors<typeof ONYXKEYS.FORMS.POLICY_TAG_NAME_FORM> = {};
        if (!values[INPUT_IDS.POLICY_TAGS_NAME] && values[INPUT_IDS.POLICY_TAGS_NAME].trim() === '') {
            errors[INPUT_IDS.POLICY_TAGS_NAME] = 'common.error.fieldRequired';
        }
        return errors;
    };

    const updateTaglistName = (values: FormOnyxValues<typeof ONYXKEYS.FORMS.POLICY_TAG_NAME_FORM>) => {
        Policy.renamePolicyTaglist(route.params.policyID, {oldName: taglistName, newName: values[INPUT_IDS.POLICY_TAGS_NAME]}, policyTags);
        Navigation.goBack();
    };

    return (
        <ScreenWrapper
            includeSafeAreaPaddingBottom={false}
            shouldEnableMaxHeight
            onEntryTransitionEnd={() => {
                inputRef.current?.focus();
            }}
            testID={WorkspaceEditTagsPage.displayName}
        >
            <HeaderWithBackButton title={translate(`workspace.tags.customTagName`)} />
            <FormProvider
                style={[styles.flexGrow1, styles.ph5]}
                formID={ONYXKEYS.FORMS.POLICY_TAG_NAME_FORM}
                onSubmit={updateTaglistName}
                validate={validateTagName}
                submitButtonText={translate('common.save')}
                enabledWhenOffline
            >
                <View style={styles.mb4}>
                    <InputWrapper
                        InputComponent={TextInput}
                        inputID={INPUT_IDS.POLICY_TAGS_NAME}
                        label={translate(`workspace.tags.customTagName`)}
                        accessibilityLabel={translate(`workspace.tags.customTagName`)}
                        defaultValue={taglistName}
                        role={CONST.ROLE.PRESENTATION}
                        ref={inputRef}
                    />
                </View>
            </FormProvider>
        </ScreenWrapper>
    );
}

WorkspaceEditTagsPage.displayName = 'WorkspaceEditTagsPage';

export default withOnyx<WorkspaceEditTagsPageProps, WorkspaceEditTagsPageOnyxProps>({
    policyTags: {
        key: ({route}) => `${ONYXKEYS.COLLECTION.POLICY_TAGS}${route.params.policyID}`,
    },
})(WorkspaceEditTagsPage);
