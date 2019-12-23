import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Grommet, Grid, Box } from 'grommet';
import Universe from '../Universe';
/* import SiteHeader from '../SiteHeader';
import Content from '../../views/Content';
import Navigation from '../Navigation';

// pages
import Home from '../pages/Home';
import Beta from '../pages/Beta';
import MainGrid from './MainGrid'; */
import theme from '../../theme';

export default class Main extends PureComponent {
  render() {
    return (
      <main>
        <Grommet theme={theme} full>
          <Switch>
            <Route path="/" exact component={Universe} />
            <Route component={Universe} />
          </Switch>
        </Grommet>
      </main>
    );
  }
}

/**
 <MainGrid>
 <Box gridArea="header">
 <SiteHeader />
 </Box>
 <Box gridArea="nav">
 <Navigation />
 </Box>
 <Box gridArea="main">
 <Content>
 <Switch>
 <Route path="/" exact component={Home} />
 <Route path="/beta" exact component={Beta} />
 <Route component={Home} />
 </Switch>
 </Content>
 </Box>
 </MainGrid>

 */
