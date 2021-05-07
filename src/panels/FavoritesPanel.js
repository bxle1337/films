import React from 'react';
import PropTypes from 'prop-types';
import bridge from '@vkontakte/vk-bridge';

import { Panel, PanelHeader,SimpleCell, Snackbar,PanelHeaderBack, FixedLayout,CardGrid,Card, RichCell,Header,Separator, Title,Subhead, MiniInfoCell, Button, Group, Cell, Div, Avatar } from '@vkontakte/vkui';
import { Icon20VideoOutline, Icon20RecentOutline,Icon24Copy,Icon24Link,Icon24VideoCircleOutline,Icon24Favorite,Icon20FavoriteCircleFillYellow,Icon20GlobeOutline, Icon20VideocamOutline,Icon20CalendarOutline } from '@vkontakte/icons';
const FavoritesPanel = ({ id, go,setPopout,Favorites, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader left={<PanelHeaderBack data-to="home" onClick={go} />}>Закладки</PanelHeader>
			{Favorites}
	</Panel>
);
export default FavoritesPanel;
