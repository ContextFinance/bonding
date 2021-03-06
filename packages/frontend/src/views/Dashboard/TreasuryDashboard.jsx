import { useEffect, useState } from 'react';
import { Paper, Grid, Typography, Box, Zoom, Container, useMediaQuery } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import Chart from '../../components/Chart/Chart.jsx';
import { trim, formatCurrency } from '../../helpers';
import {
  treasuryDataQuery,
  rebasesDataQuery,
  bulletpoints,
  tooltipItems,
  tooltipInfoMessages,
  itemType,
} from './treasuryData.js';
import { useTheme } from '@material-ui/core/styles';
import './treasury-dashboard.scss';
import apollo from '../../lib/apolloClient';
import InfoTooltip from 'src/components/InfoTooltip/InfoTooltip.jsx';
import ContextKing from './otterking.png';

const percentFormatter = Intl.NumberFormat('en', { style: 'percent', minimumFractionDigits: 2 });

function TreasuryDashboard() {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);
  const [staked, setStaked] = useState(null);
  const theme = useTheme();
  const smallerScreen = useMediaQuery('(max-width: 650px)');
  const verySmallScreen = useMediaQuery('(max-width: 379px)');

  const marketPrice = useSelector(state => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector(state => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector(state => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector(state => {
    return state.app.marketCap;
  });
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const backingPerContext = useSelector(state => state.app.backingPerContext);
  const stakingAPY = useSelector(state => state.app.stakingAPY);
  const stakingTVL = useSelector(state => state.app.stakingTVL);
  const treasuryRunway = useSelector(state => state.app.treasuryRunway);
  const stakingRatio = useSelector(state => state.app.stakingRatio);
  const pol = useSelector(state => state.app.pol);

  useEffect(() => {
    // apollo(treasuryDataQuery).then(r => {
    //   let metrics = r.data.protocolMetrics.map(entry =>
    //     Object.entries(entry).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {}),
    //   );
    //   metrics = metrics.filter(pm => pm.treasuryMarketValue > 0);
    //   setData(metrics);
    //   let staked = r.data.protocolMetrics.map(entry => ({
    //     staked: (parseFloat(entry.sCTXTCirculatingSupply) / parseFloat(entry.ohmCirculatingSupply)) * 100,
    //     timestamp: entry.timestamp,
    //   }));
    //   staked = staked.filter(pm => pm.staked < 100);
    //   setStaked(staked);
    //   let runway = metrics.filter(pm => pm.runway10k > 5);
    //   setRunway(runway);
    // });
    // apollo(rebasesDataQuery).then(r => {
    //   let apy = r.data.rebases.map(entry => ({
    //     apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
    //     timestamp: entry.timestamp,
    //   }));
    //   apy = apy.filter(pm => pm.apy < 300000);
    //   setApy(apy);
    // });
  }, []);

  return (
    <div id="treasury-dashboard-view" className={`${smallerScreen && 'smaller'} ${verySmallScreen && 'very-small'}`}>
      <Container
        style={{
          paddingLeft: smallerScreen || verySmallScreen ? '0' : '3.3rem',
          paddingRight: smallerScreen || verySmallScreen ? '0' : '3.3rem',
        }}
      >
        <Box className={`hero-metrics`}>
          <Paper className="ohm-card">
            <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center">
              <Box className="metric market">
                <Typography variant="h6" color="textSecondary">
                  Market Cap
                </Typography>
                <Typography variant="h4">
                  {marketCap && formatCurrency(marketCap, 0)}
                  {!marketCap && <Skeleton type="text" />}
                </Typography>
              </Box>

              <Box className="metric price">
                <Typography variant="h6" color="textSecondary">
                  Context Price
                </Typography>
                <Typography variant="h4">
                  {/* appleseed-fix */}
                  {marketPrice ? formatCurrency(marketPrice, 2) : <Skeleton type="text" />}
                </Typography>
              </Box>

              <Box className="metric wsoprice">
                <Typography variant="h6" color="textSecondary">
                  Staking TVL
                  <InfoTooltip message={tooltipInfoMessages.tvl} />
                </Typography>

                <Typography variant="h4">
                  {typeof stakingTVL !== 'undefined' ? formatCurrency(stakingTVL, 2) : <Skeleton type="text" />}
                </Typography>
              </Box>

              {/* <Box className="metric wsoprice">
                <Typography variant="h6" color="textSecondary">
                  wsCTXT Price
                  <InfoTooltip
                    message={
                      'wsCTXT = sCTXT * index\n\nThe price of wsCTXT is equal to the price of Context multiplied by the current index'
                    }
                  />
                </Typography>

                <Typography variant="h4">
                  {wsCTXTPrice ? formatCurrency(wsCTXTPrice, 2) : <Skeleton type="text" />}
                </Typography>
              </Box> */}
              <Box className="metric circ">
                <Typography variant="h6" color="textSecondary">
                  Staking APY
                  <InfoTooltip message={tooltipInfoMessages.apy} />
                </Typography>
                <Typography variant="h4">
                  {typeof stakingAPY !== 'undefined' ? percentFormatter.format(stakingAPY) : <Skeleton type="text" />}
                </Typography>
              </Box>

              <Box className="metric circ">
                <Typography variant="h6" color="textSecondary">
                  Staking Ratio
                  <InfoTooltip message={tooltipInfoMessages.staked} />
                </Typography>
                <Typography variant="h4">
                  {typeof stakingRatio !== 'undefined' ? (
                    percentFormatter.format(stakingRatio)
                  ) : (
                    <Skeleton type="text" />
                  )}
                </Typography>
              </Box>

              <Box className="metric circ">
                <Typography variant="h6" color="textSecondary">
                  Protocol Own Liquidity
                  <InfoTooltip message={tooltipInfoMessages.pol} />
                </Typography>
                <Typography variant="h4">{pol ? percentFormatter.format(pol) : <Skeleton type="text" />}</Typography>
              </Box>

              <Box className="metric bpo">
                <Typography variant="h6" color="textSecondary">
                  Backing per Context
                </Typography>
                <Typography variant="h4">
                  {backingPerContext ? formatCurrency(backingPerContext, 2) : <Skeleton type="text" />}
                </Typography>
              </Box>

              <Box className="metric circ">
                <Typography variant="h6" color="textSecondary">
                  Runway
                  <InfoTooltip message={tooltipInfoMessages.runway} />
                </Typography>
                <Typography variant="h4">
                  {typeof treasuryRunway !== 'undefined' ? (
                    Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(treasuryRunway) + ' Days'
                  ) : (
                    <Skeleton type="text" />
                  )}
                </Typography>
              </Box>

              <Box className="metric index">
                <Typography variant="h6" color="textSecondary">
                  Current Index
                  <InfoTooltip
                    message={
                      'The current index tracks the amount of sCTXT accumulated since the beginning of staking. Basically, how much sCTXT one would have if they staked and held a single Context from day 1.'
                    }
                  />
                </Typography>
                <Typography variant="h4">
                  {currentIndex ? trim(currentIndex, 2) + ' sCTXT' : <Skeleton type="text" />}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* <Zoom in={true}>
          <Grid container spacing={2} className="data-grid">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <Chart
                  type="area"
                  data={data}
                  dataKey={['totalValueLocked']}
                  stopColor={[['#768299', '#98B3E9']]}
                  headerText="Total Value Deposited"
                  headerSubText={`${data && formatCurrency(data[0].totalValueLocked)}`}
                  bulletpointColors={bulletpoints.tvl}
                  itemNames={tooltipItems.tvl}
                  itemType={itemType.dollar}
                  infoTooltipMessage={tooltipInfoMessages.tvl}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <Chart
                  type="stack"
                  data={data}
                  dataKey={[
                    'treasuryDaiMarketValue',
                    'treasuryFraxMarketValue',
                    'treasuryWETHMarketValue',
                    'treasuryXsushiMarketValue',
                    'treasuryLusdRiskFreeValue',
                  ]}
                  stopColor={[
                    ['#F5AC37', '#EA9276'],
                    ['#768299', '#98B3E9'],
                    ['#DC30EB', '#EA98F1'],
                    ['#8BFF4D', '#4C8C2A'],
                    ['#ff758f', '#c9184a'],
                  ]}
                  headerText="Market Value of Treasury Assets"
                  headerSubText={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
                  bulletpointColors={bulletpoints.coin}
                  itemNames={tooltipItems.coin}
                  itemType={itemType.dollar}
                  infoTooltipMessage={tooltipInfoMessages.mvt}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card ohm-chart-card">
                <Chart
                  type="stack"
                  data={data}
                  format="currency"
                  dataKey={['treasuryDaiRiskFreeValue', 'treasuryFraxRiskFreeValue', 'treasuryLusdRiskFreeValue']}
                  stopColor={[
                    ['#F5AC37', '#EA9276'],
                    ['#768299', '#98B3E9'],
                    ['#DC30EB', '#EA98F1'],
                    ['#000', '#fff'],
                    ['#000', '#fff'],
                  ]}
                  headerText="Risk Free Value of Treasury Assets"
                  headerSubText={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
                  bulletpointColors={bulletpoints.rfv}
                  itemNames={tooltipItems.rfv}
                  itemType={itemType.dollar}
                  infoTooltipMessage={tooltipInfoMessages.rfv}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="area"
                  data={data}
                  dataKey={['treasuryOhmDaiPOL']}
                  stopColor={[['rgba(128, 204, 131, 1)', 'rgba(128, 204, 131, 0)']]}
                  headerText="Protocol Owned Liquidity Context-DAI"
                  headerSubText={`${data && trim(data[0].treasuryOhmDaiPOL, 2)}% `}
                  dataFormat="percent"
                  bulletpointColors={bulletpoints.pol}
                  itemNames={tooltipItems.pol}
                  itemType={itemType.percentage}
                  infoTooltipMessage={tooltipInfoMessages.pol}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                  isPOL={true}
                />
              </Paper>
            </Grid>
            {/*  Temporarily removed until correct data is in the graph */}
        {/* <Grid item lg={6} md={12} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="bar"
                  data={data}
                  dataKey={["holders"]}
                  headerText="Holders"
                  stroke={[theme.palette.text.secondary]}
                  headerSubText={`${data && data[0].holders}`}
                  bulletpointColors={bulletpoints.holder}
                  itemNames={tooltipItems.holder}
                  itemType={""}
                  infoTooltipMessage={tooltipInfoMessages.holder}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="area"
                  data={staked}
                  dataKey={['staked']}
                  stopColor={[['#55EBC7', '#47ACEB']]}
                  headerText="Context Staked"
                  dataFormat="percent"
                  headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
                  isStaked={true}
                  bulletpointColors={bulletpoints.staked}
                  infoTooltipMessage={tooltipInfoMessages.staked}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="line"
                  scale="log"
                  data={apy}
                  dataKey={['apy']}
                  color={theme.palette.text.primary}
                  stroke={[theme.palette.text.primary]}
                  headerText="APY over time"
                  dataFormat="percent"
                  headerSubText={`${apy && trim(apy[0].apy, 2)}%`}
                  bulletpointColors={bulletpoints.apy}
                  itemNames={tooltipItems.apy}
                  itemType={itemType.percentage}
                  infoTooltipMessage={tooltipInfoMessages.apy}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="ohm-card">
                <Chart
                  type="multi"
                  data={runway}
                  dataKey={['runwayCurrent', 'runway7dot5k', 'runway5k', 'runway2dot5k']}
                  color={theme.palette.text.primary}
                  stroke={[theme.palette.text.primary, '#2EC608', '#49A1F2', '#ff758f']}
                  headerText="Runway Available"
                  headerSubText={`${data && trim(data[0].runwayCurrent, 1)} Days`}
                  dataFormat="days"
                  bulletpointColors={bulletpoints.runway}
                  itemNames={tooltipItems.runway}
                  itemType={''}
                  infoTooltipMessage={tooltipInfoMessages.runway}
                  expandedGraphStrokeColor={theme.palette.graphStrokeColor}
                />
              </Paper>
            </Grid>
          </Grid>
        </Zoom>*/}
      </Container>
    </div>
  );
}

export default TreasuryDashboard;
