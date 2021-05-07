import React from 'react';
import PropTypes from 'prop-types';
import bridge from '@vkontakte/vk-bridge';

import { Panel, PanelHeader,SimpleCell, Snackbar, FixedLayout,CardGrid,Card, RichCell,Header,Separator, Title,Subhead, MiniInfoCell, Button, Group, Cell, Div, Avatar } from '@vkontakte/vkui';
import { Icon20VideoOutline, Icon20RecentOutline,Icon24Copy,Icon24Link,Icon24VideoCircleOutline,Icon24Favorite,Icon20FavoriteCircleFillYellow,Icon20GlobeOutline, Icon20VideocamOutline,Icon20CalendarOutline } from '@vkontakte/icons';
const Persik = ({ id, go,setPopout, TitleFilm,SubnavigationButton,SubnavigationBar, description, Films, ButtonNext, fetchedUser }) => (
	<Panel id={id}>
		<PanelHeader>Случайный фильм</PanelHeader>
		{Films &&
        <Div style={{ float: "center", display: "inline-block"}} >	
        <img style={{ width : "40%", float: "left", display: "inline-block", borderRadius: 10}} src={Films.data.posterUrl} />		
        <Title className="Text" style={{ float: "left", width : "50%", marginLeft: 16}} level="2" weight="bold">{TitleFilm}</Title>
        <MiniInfoCell
		  style={{ float: "left", width : "45%", whiteSpace: "nowrap", overflow: "hidden"}}
          before={<Icon20GlobeOutline fill="#fc853a"/>}
          textWrap="full"
          textLevel="primary"
        >
		{Films.data.countries[0].country}
        </MiniInfoCell>
		<MiniInfoCell
		  style={{ float: "left", width : "50%"}}
          before={<Icon20CalendarOutline fill="#fc853a"/>}
          textWrap="full"
          textLevel="primary"
        >
		Год: {Films.data.year}
        </MiniInfoCell>
		<MiniInfoCell
		  style={{ float: "left", width : "50%"}}
          before={<Icon20RecentOutline fill="#fc853a" />}
          textWrap="full"
          textLevel="primary"
        >
		Длительность: {Films.data.filmLength}
        </MiniInfoCell>
		<MiniInfoCell
		  style={{ float: "left", width : "50%"}}
          before={<Icon20VideoOutline fill="#fc853a" />}
          textWrap="full"
          textLevel="primary"
        >
		Жанр: {Films.data.genres[0].genre}
        </MiniInfoCell>
		<MiniInfoCell
		  style={{ float: "left", width : "50%"}}
          before={<Icon20FavoriteCircleFillYellow />}
          textWrap="full"
          textLevel="primary"
        >
		Рейтинг: {Films.rating.rating}/10
        </MiniInfoCell>
        </Div>}
		{Films && 
		<div>
		<Separator style={{ marginTop: 8}} />
		<SimpleCell before={<Icon24Copy fill="#fc853a"/>}
		onClick={() => {
			bridge.send("VKWebAppCopyText", {"text": Films.data.nameRu});
			setPopout(
			<Snackbar before={<Icon24Copy fill="#fc853a"/>} onClose={() => setPopout(null)} duration={1000} >
			Скопировано
			</Snackbar>
			)
			
		}}
		>Копировать название</SimpleCell>
		<SimpleCell style={{marginTop: -10}} before={<Icon24Favorite fill="#fc853a"/>}
		onClick={() => {
			async function SaveFilm(){
			const startParams = new URLSearchParams(window.location.search)
            const allparams = btoa(window.location.search)
			const result = await fetch('https://simpletraffic.xyz/vkapi/kino.php?action=save&key=' + allparams + "&id=" + Films.data.filmId);
			const datas = await result.json()
			setPopout(
			<Snackbar before={<Avatar src={datas.photo} />} onClose={() => setPopout(null)} duration={1000} >
				{datas.text}
			</Snackbar>
			)
			}SaveFilm()
		}}
		>В закладки</SimpleCell>
		<Separator style={{ marginTop: 0}} />
		</div>}
		{Films && 
		<Group header={<Header mode="secondary">Описание "{Films.data.nameRu}"</Header>}>
		<Div style={{marginBottom: "25%"}}>
		<Subhead weight="regular">{description}<br/><br/></Subhead>
		</Div>
		</Group>}
		<FixedLayout vertical="bottom">
            <Div>
			{ButtonNext}
			</Div>
          </FixedLayout>
	</Panel>
);
export default Persik;
