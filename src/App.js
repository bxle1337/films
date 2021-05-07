import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner,Separator, Card,Button,Div,Avatar,Group,CellButton, RichCell,AdaptivityProvider, AppRoot } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { Icon28ArrowRightOutline, Icon28FavoriteOutline } from '@vkontakte/icons';
import Home from './panels/Home';
import Persik from './panels/Persik';
import FavoritesPanel from './panels/FavoritesPanel';

const App = () => {
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [Films, setFilms] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [ButtonNext, setButtonNext] = useState(null);
	const [description, setdescription] = useState(null);
	const [TitleFilm, setTitleFilm] = useState(null);
	const [Favorites, setFavorites] = useState(null);

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setUser(user);
			setPopout(null);
			setButtonNext(<React.Fragment>
			<Card style={{marginBottom: 6}}>
			<CellButton data-to="FavoritesPanel" after={<Icon28FavoriteOutline/>} centered onClick={() => {setActivePanel("FavoritesPanel")}} >Мои закладки</CellButton>
			</Card>
			<Card>
			<CellButton id="button" after={<Icon28ArrowRightOutline/>} centered onClick={() => {GetFilms()}} >Следующий фильм</CellButton>
			</Card></React.Fragment>)
		}fetchData();
		async function GetFilms() {
			document.getElementById("button").style.display = "none";
			setPopout(<ScreenSpinner size='large' />)
			const startParams = new URLSearchParams(window.location.search)
            const allparams = btoa(window.location.search)
			const result = await fetch('https://simpletraffic.xyz/vkapi/kino.php?action=getfilm&key=' + allparams);
			const datas = await result.json()
			if(await datas.error === "error"){
			GetFilms();
			}else{
				let text = datas.data.nameRu;
				setTitleFilm(text)
				if (text.length > 20) {
            text = text.substr(0, 20);
            text = text + "...";
			setTitleFilm(text)
        }
		let about = datas.data.description
		let count = 0
		if(datas.data.description != null){
			count = about.split(' ')
		}
		var aboutstr = datas.data.description
		setdescription(aboutstr)
		if(count.length > 25){
			aboutstr = ""
			var aboutstr2 = ""
			for(let i=0;i < 25;i++){
				aboutstr = aboutstr + " " + count[i] 
			}
			for(let i=25;i < count.length;i++){
				aboutstr2 = aboutstr2 + " " + count[i] 
			}
			aboutstr = aboutstr + "..."
			setdescription(<React.Fragment>{aboutstr}<br/><Button style={{marginLeft: -16}} onClick={() => {
				Show()
			}} mode="tertiary">Показать полностью...</Button><br/><Group></Group></React.Fragment>)
		}
		function Show(){
			var fulltext = aboutstr.replace("...", aboutstr2)
			setdescription(fulltext)
		}
			setFilms(datas);
			setActivePanel("persik");
			setPopout(null)
			document.getElementById("button").style.display = "";
			}
		}
		async function GetFavorites() {
			const startParams = new URLSearchParams(window.location.search)
            const allparams = btoa(window.location.search)
			const result = await fetch('https://simpletraffic.xyz/vkapi/kino.php?action=getfavorite&key=' + allparams);
			const datas = await result.json()
			const response = RenderFavorites(datas)
			setFavorites(response)
		}GetFavorites();
		setInterval(function(){GetFavorites()} ,15000)
		
		function RenderFavorites(mass) {
  let arr = mass;
  let result = arr.map(function(item) {
	return <React.Fragment><RichCell
        disabled
        multiline
        before={<Avatar size={72} mode="image" style={{
			backgroundImage: "url(" + item[0].photo + ")",
			backgroundSize: 72
		}} />}
        caption={item[0].time}
        after="+ 1 500 ₽"
		actions={
          <React.Fragment>
            <Button mode="tertiary">Подробнее</Button>
            <Button mode="tertiary" hasHover={false}>Напомнить позже</Button>
          </React.Fragment>
        }
      >
	  {item[0].name}
      </RichCell><Separator style={{ marginTop: 8}} /></React.Fragment>
});

return result
}
		
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<AdaptivityProvider>
			<AppRoot>
				<View activePanel={activePanel} popout={popout}>
					<Home id='home' ButtonNext={ButtonNext} fetchedUser={fetchedUser} go={go} />
					<Persik id='persik' setPopout={setPopout} TitleFilm={TitleFilm} description={description} Films={Films} ButtonNext={ButtonNext} go={go} />
					<FavoritesPanel id='FavoritesPanel' Favorites={Favorites} setPopout={setPopout} go={go} />
				</View>
			</AppRoot>
		</AdaptivityProvider>
	);
}

export default App;
