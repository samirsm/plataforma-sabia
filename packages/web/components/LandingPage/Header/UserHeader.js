import React from 'react';
import { MdAccountCircle } from 'react-icons/md';
import styled, { css, useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useModal, useAuth, useVisibleComponent } from '../../../hooks';
import { UserProfileDropDown } from '../../UserProfile';

const UserHeader = () => {
	const { colors } = useTheme();
	const { openModal } = useModal();
	const { user } = useAuth();
	const { t } = useTranslation(['common']);
	const [ref, isDropDownVisible, setIsDropDownVisible] = useVisibleComponent();

	const toggleVisible = () => setIsDropDownVisible((prev) => !prev);

	const handleToggleDropDown = (e) => {
		e.preventDefault();
		if (!user?.email) {
			openModal('login');
		} else {
			toggleVisible();
		}
	};

	return (
		<LoginBox ref={ref}>
			<UserButton type="button" onClick={handleToggleDropDown}>
				<MdAccountCircle color={colors.secondary} />
				<span>{user?.first_name || t('common:login')}</span>
			</UserButton>
			<UserProfileDropDown visible={isDropDownVisible} toggleVisible={toggleVisible} />
		</LoginBox>
	);
};

const LoginBox = styled.div`
	height: 100%;
`;

const UserButton = styled.button`
	${({ theme: { colors, sizes, screens } }) => css`
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${colors.mediumGray};
		background: none;
		border: 0;
		font-size: 1.2rem;
		height: 100%;
		min-width: 8rem;
		padding: 0 2rem;
		transition: color 0.3s;
		cursor: pointer;

		svg {
			height: ${sizes.bigIcon}rem;
			width: ${sizes.bigIcon}rem;
			margin-right: 1.2rem;
		}

		span {
			font-size: 1.4rem;
			text-transform: uppercase;
			font-weight: bold;
			color: ${colors.secondary};
		}

		:hover {
			color: ${colors.secondary};
		}

		@media (max-width: ${screens.medium}px) {
			a {
				font-size: 1rem;
			}

			svg {
				height: ${sizes.defaultIcon}rem;
				width: ${sizes.defaultIcon}rem;
			}
		}
	`}
`;

export default UserHeader;