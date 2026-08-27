import styled from "styled-components";
import { breakpoints, theme } from "./theme";
import {
  ContainerCard,
  LeadText,
  PageContent,
  ToolTitle,
} from "./components/common-styled-components";
import { SurplusCalculator } from "./components/surplus-calculator/SurplusCalculator";
import logo from "./assets/ahti-climate-logo.png";

const AppMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  padding: ${theme.spacing(4)};
  box-sizing: border-box;
  background-image: linear-gradient(
    to bottom,
    ${theme.colors.blue},
    ${theme.colors.blueGradientEnd} 100%
  );
  background-repeat: no-repeat;

  @media (max-width: ${breakpoints.mobilePlus}px) {
    padding: 0;
  }
`;

const MainCardContent = styled.div`
  width: 100%;
  display: block;
`;

const MainPanel = styled.main`
  width: 100%;
  min-height: 520px;
  background: ${theme.colors.grey(5)};
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing(2)};
  min-height: 110px;
  padding: ${theme.spacing(3)} ${theme.spacing(4)};
  background: linear-gradient(
    90deg,
    ${theme.colors.lightBlue} 0%,
    ${theme.colors.blue} 100%
  );
  color: ${theme.colors.white};
  box-sizing: border-box;
`;

const HeaderTitle = styled.h1`
  ${theme.fontTitle};
  ${theme.fontSize(2)};
  margin: 0;
  color: ${theme.colors.white};
`;

const HeaderMeta = styled.span`
  ${theme.fontLabelBold};
  ${theme.fontSize(-1)};
  color: ${theme.colors.white};
  opacity: 0.9;
`;

const ContentArea = styled.div`
  padding: ${theme.spacing(4)};

  @media (max-width: ${breakpoints.mobilePlus}px) {
    padding: ${theme.spacing(3)};
  }
`;

const PageHeader = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: ${theme.spacing(4)};
  flex-wrap: wrap;
  width: 100%;
  border-bottom: 2px solid ${theme.colors.darkBlue};
  padding-bottom: ${theme.spacing(2)};
`;

const Kicker = styled.p`
  ${theme.fontLabelBold};
  ${theme.fontSize(-2)};
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${theme.colors.dimBlue};
  margin: 0 0 ${theme.spacing(1)};
`;

const Headline = styled(ToolTitle)`
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.01em;

  span {
    color: ${theme.colors.lightBlue};
  }
`;

const Brandmark = styled.img`
  width: 150px;
  height: auto;
`;

const App = () => {
  return (
    <AppMain data-print="hide">
      <ContainerCard maxWidth={1400}>
        <MainCardContent>
          <MainPanel>
            <HeaderBar>
              <HeaderTitle>Surplus calculator</HeaderTitle>
              <HeaderMeta>Ahti Climate</HeaderMeta>
            </HeaderBar>

            <ContentArea>
              <PageContent align="left">
                <PageHeader>
                  <div>
                    <Kicker>FuelEU Maritime 2026 · pooling supply side</Kicker>
                    <Headline>
                      What your biofuel switch is
                      <br />
                      <span>worth in the pool</span>
                    </Headline>
                  </div>
                  <Brandmark src={logo} alt="Ahti Climate" />
                </PageHeader>

                <LeadText>
                  Set the fuel switch you are considering and see the compliance
                  surplus it generates, the FuelEU penalty that surplus avoids,
                  the EU ETS cost it saves, and what the biofuel premium costs.
                </LeadText>

                <SurplusCalculator />
              </PageContent>
            </ContentArea>
          </MainPanel>
        </MainCardContent>
      </ContainerCard>
    </AppMain>
  );
};

export default App;
