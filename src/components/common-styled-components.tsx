/* eslint-disable react-refresh/only-export-components */
import { type ReactNode } from "react";
import type { Styles } from "react-modal";
import styled from "styled-components";
import { breakpoints, theme } from "../theme";

export const ArticleMain = styled.section`
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const UISection = styled.div`
  width: 100%;
  margin: ${theme.spacing(4)} 0 ${theme.spacing(5)} 0;
`;

export const TextContent = styled.div`
  max-width: 640px;
  width: 100%;
`;

export const WideTextContent = styled.div`
  max-width: 1220px;
  width: 100%;
`;

export const PageContent = styled.div<{ align?: "left" | "center" }>`
  width: 100%;
  max-width: 1400px;
  margin: ${theme.spacing(3)} auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(4)};
  align-items: ${(p) => (p.align === "left" ? "flex-start" : "center")};
`;

export const DEFAULT_RADIUS = "12px";

export const baseReactModalStyles: Styles = {
  overlay: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    minWidth: "280px",
    maxWidth: "640px",
    maxHeight: "80vh",
    overflow: "scroll",
  },
};

export const ContainerCard = styled.div<{ maxWidth?: number }>`
  max-width: ${(p) => (p.maxWidth ? `${p.maxWidth}px` : "1400px")};
  width: 100%;
  background-color: white;
  border-radius: ${DEFAULT_RADIUS};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${theme.spacing(5)};
  min-height: 400px;
  box-sizing: border-box;
  background-color: ${theme.colors.grey(5)};
  min-height: 0;

  @media (max-width: ${breakpoints.mobilePlus}px) {
    border-radius: 0px;
    box-shadow: none;
  }
`;

export const FullWidthContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

export const PageTitle = styled.h1`
  ${theme.fontTitle};
  color: ${theme.colors.blackText};
  ${theme.fontSize(3)};
  cursor: pointer;
`;

export const ToolTitle = styled.h1`
  ${theme.fontTitle};
  color: ${theme.colors.blackText};
  ${theme.fontSize(2)};
`;

export const SectionTitle = styled.h2`
  ${theme.fontTitle};
  color: ${theme.colors.blackText};
  ${theme.fontSize(1)};
  margin: 0 0 ${theme.spacing(3)} 0;
  padding: 0 0 ${theme.spacing(0)} 0;
  width: 100%;
  border-bottom: 1px solid ${theme.colors.grey(4)};
`;

const TitleRowContainer = styled.div<{ showBorder?: boolean }>`
  ${theme.fontTitle};
  color: ${theme.colors.blackText};
  margin: 0 0 ${theme.spacing(2)} 0;
  padding: 0 0 ${theme.spacing(0)} 0;
  width: 100%;
  border-bottom: ${(p) =>
    p.showBorder ? `1px solid ${theme.colors.grey(4)}` : "none"};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SectionTitleContent = styled(SectionTitle)`
  display: inline-block;
  margin: 0;
  padding: 0;
  border: none;
`;

export const SmallTitle = styled.h3`
  ${theme.fontTitle};
  color: ${theme.colors.blackText};
  ${theme.fontSize(1)};
  padding: 0;
  margin: 0;
  width: 100%;
`;

export const SmallTitleContent = styled(SmallTitle)`
  display: inline-block;
  margin: 0;
  padding: 0;
  border: none;
`;

export const SmallSubtitle = styled.h4`
  ${theme.fontTitle};
  color: ${theme.colors.blackText};
  ${theme.fontSize(-1)};
  padding: 0;
  margin: 0;
  width: 100%;
  text-transform: uppercase;
`;

const SmallSubtitleContent = styled(SmallSubtitle)`
  display: inline-block;
  margin: 0;
  padding: 0;
  border: none;
`;

export const TitleWithExtraContent = ({
  titleLevel,
  children,
  extraContent,
  style,
}: {
  children?: ReactNode;
  extraContent?: ReactNode;
  titleLevel: "Section" | "Small" | "SmallSubtitle";
  style?: React.CSSProperties;
}) => {
  let titleContent: ReactNode;
  switch (titleLevel) {
    case "Section":
      titleContent = <SectionTitleContent>{children}</SectionTitleContent>;
      break;
    case "Small":
      titleContent = <SmallTitleContent>{children}</SmallTitleContent>;
      break;
    case "SmallSubtitle":
      titleContent = <SmallSubtitleContent>{children}</SmallSubtitleContent>;
  }
  return (
    <TitleRowContainer
      showBorder={titleLevel === "Section"}
      style={{ ...style }}
    >
      {titleContent}
      {extraContent}
    </TitleRowContainer>
  );
};

export const LeadText = styled.p`
  ${theme.fontNormal};
  ${theme.fontSize(0)};
  color: ${theme.colors.blackText};
  margin: 0 0 ${theme.spacing(3)} 0;
  line-height: 1.6;
`;

export const P = styled.p`
  ${theme.fontNormal};
  ${theme.fontSize(0)};
  color: ${theme.colors.blackText};
  margin: 0 0 ${theme.spacing(3)} 0;
  line-height: 1.6;
  max-width: 640px;
  width: 100%;
`;

export const PTight = styled(P)`
  line-height: 1.2;
  margin: 0;
`;

export const DetailP = styled(P)`
  margin-bottom: ${theme.spacing(0)};
`;

export const PSmall = styled(P)`
  ${theme.fontSize(-1)};
  margin-bottom: ${theme.spacing(0)};
`;

export const Ingress = styled(P)`
  ${theme.fontNormal};
  ${theme.fontSize(0)};
`;

export const A = styled.a<{ color?: string }>`
  color: ${(p) => p.color ?? theme.colors.blue};
  text-decoration: underline;
  text-decoration-color: ${(p) => p.color ?? theme.colors.blue};

  &:active {
    text-decoration-color: ${theme.colors.blackText};
  }
  &:visited {
    text-decoration-color: ${(p) => p.color ?? theme.colors.blue};
  }
`;

export const ButtonLikeA = styled.a`
  background-color: ${theme.colors.blue};
  padding: ${theme.spacing(0)} ${theme.spacing(2)};
  color: white;
  ${theme.fontBold};
  ${theme.fontSize(-1)};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 1;
  text-align: center;
  justify-content: center;
  white-space: nowrap;
  display: inline-block;
  border-radius: 6px;
  border: 1px solid ${theme.colors.blue};
  transition: all 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  text-decoration: none;

  & + & {
    margin-left: ${theme.spacing(2)};
  }

  &:hover {
    background-color: ${theme.colors.darkBlue};
    color: white;
  }
`;

export const Navigation = styled.nav`
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: ${theme.spacing(3)};
  row-gap: ${theme.spacing(1)};
  padding: 0;
  margin-bottom: ${theme.spacing(3)};
`;

export const Li = styled.li`
  ${theme.fontNormal};
  ${theme.fontSize(0)};
  color: ${theme.colors.blackText};
  line-height: 1.6;
  margin-bottom: ${theme.spacing(1)};
`;

export const Bold = styled.span`
  ${theme.fontBold};
`;

export const Italic = styled.span`
  font-style: italic;
`;

export const GraphTitle = styled.h4`
  max-width: 640px;
  ${theme.fontLabelBold};
  ${theme.fontSize(0)};
  margin: ${theme.spacing(3)} 0 ${theme.spacing(1)} 0;
`;

export const GraphSubTitle = styled.h5`
  max-width: 640px;
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  margin: 0 0 ${theme.spacing(1)} 0;
`;

export const GraphLabel = styled.text`
  ${theme.fontBold};
`;

export const GraphSVG = styled.svg`
  margin-top: ${theme.spacing(2)};
`;

export const Caption = styled.div`
  width: 100%;
  ${theme.fontNormal};
  ${theme.fontSize(-1)};
  color: ${theme.colors.darkBlue};
`;

export const TextComment = styled.span`
  color: red;
`;

export const Grid = styled.div<{
  full?: boolean;
  minCellWidth?: number;
  maxCellWidth?: number;
}>`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(
    auto-fit,
    minmax(
      ${(p) =>
        p.minCellWidth !== undefined ? `${p.minCellWidth}px` : "260px"},
      ${(p) =>
        p.maxCellWidth !== undefined
          ? `${p.maxCellWidth}px`
          : p.full
            ? "100%"
            : "1fr"}
    )
  );
  grid-column-gap: ${theme.spacing(4)};
  grid-row-gap: ${theme.spacing(3)};
  margin: ${theme.spacing(2)} 0;
  align-items: start;

  @media (max-width: ${breakpoints.mobilePlus}px) {
    grid-template-columns: 100%;
  }
`;

export const ContentGrid = styled.div<{ $cols?: number }>`
  display: grid;
  width: 100%;
  max-width: 100%;
  grid-template-columns: repeat(
    ${(p) => (p.$cols ? p.$cols : 3)},
    minmax(0, 1fr)
  );
  grid-column-gap: ${theme.spacing(4)};
  grid-row-gap: ${theme.spacing(3)};
  margin: 0;
  align-items: start;
  box-sizing: border-box;
  overflow-x: auto;

  @media (max-width: ${breakpoints.desktop}px) {
    grid-template-columns: repeat(
      ${(p) => Math.min(p.$cols ?? 3, 2)},
      minmax(0, 1fr)
    );
  }

  @media (max-width: ${breakpoints.tablet}px) {
    grid-template-columns: 100%;
  }
`;

export const GridCard = styled.div<{ $cols?: number }>`
  background-color: white;
  border-radius: ${DEFAULT_RADIUS};
  padding: ${theme.spacing(3)};
  grid-column: span ${(p) => p.$cols ?? 1};
  overflow-x: auto;
`;

export const GridSpacer = styled.div`
  height: 0;
`;

export const Legend = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${theme.spacing(4)};
`;

interface LegendItemProps {
  color: string;
  text: string;
  textColor?: string;
}

const LegendItemElement = styled.div<{ textColor?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  margin-right: ${theme.spacing(2)};
  margin-top: ${theme.spacing(1)};
  ${theme.fontSize(-1)};
  ${theme.fontLabelBold};
  color: ${(p) => (p.textColor ? p.textColor : theme.colors.blackText)};
`;

const ColorMarker = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  background-color: ${(p) => p.color};
  margin-right: ${theme.spacing(0)};
  border-radius: 50%;
`;

export const LegendItem: React.FunctionComponent<LegendItemProps> = (props) => (
  <LegendItemElement textColor={props.textColor}>
    <ColorMarker color={props.color} />
    <div>{props.text}</div>
  </LegendItemElement>
);

export const Button = styled.button<{ selected?: boolean }>`
  background-color: ${theme.colors.darkBlue};
  padding: ${theme.spacing(0)} ${theme.spacing(2)};
  color: white;
  ${theme.fontBold};
  ${theme.fontSize(-1)};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 1;
  text-align: center;
  justify-content: center;
  white-space: nowrap;
  display: inline-block;
  transition: all 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: none;

  & + & {
    margin-left: ${theme.spacing(2)};
  }

  &:hover {
    background-color: ${theme.colors.blue};
    color: white;
  }

  &:disabled {
    background-color: ${theme.colors.grey(3)};
    border: 1px solid ${theme.colors.grey(2)};
    color: ${theme.colors.grey(2)};
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled(Button)<{ color?: string }>`
  background-color: white;
  color: ${(p) => p.color ?? theme.colors.darkBlue};
  border: none;

  &:disabled {
    background-color: white;
    color: ${theme.colors.grey(2)};
    border: none;
  }
`;

export const NavigationButton = styled.div<{ selected?: boolean }>`
  background-color: ${(p) =>
    p.selected ? theme.colors.darkBlue : "transparent"};
  padding: ${theme.spacing(1)} ${theme.spacing(2)};
  color: ${(p) => (p.selected ? "white" : theme.colors.darkBlue)};
  ${theme.fontBold};
  ${theme.fontSize(-1)};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 1;
  text-align: center;
  justify-content: center;
  white-space: nowrap;
  display: inline-block;

  & + & {
    margin-left: ${theme.spacing(2)};
  }

  &:hover {
    background-color: ${theme.colors.darkBlue};
    color: white;
  }
`;

export const SmallButton = styled(Button)`
  background-color: transparent;
  color: ${theme.colors.darkBlue};
  padding: 2px 4px;
  ${theme.fontNormal};
  border: none;
`;

export const Row = styled.div<{ gap?: number; $responsive?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: ${(p) => (p.gap !== undefined ? theme.spacing(p.gap) : "0")};
  ${(p) =>
    p.$responsive
      ? `
    @media (max-width: ${breakpoints.mobilePlus}px) {
      flex-direction: column;
    }
  `
      : ""}
`;

export const CenteredRow = styled(Row)`
  width: 100%;
  justify-content: center;
`;

export const SeparatedRow = styled(Row)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export const GraphImage = styled.img<{ paddingTop?: number }>`
  width: 100%;
  ${(p) => (p.paddingTop ? `padding-top: ${p.paddingTop}px;` : "")}
`;

export const Selector = styled.div<{ horizontal?: boolean }>`
  margin-top: ${theme.spacing(2)};
  display: flex;
  width: 100%;
  ${theme.fontSize(-1)};
  ${(p) =>
    p.horizontal
      ? `
    flex-direcion: row;
    align-items: center;
  `
      : `
    flex-direction: column;
  `}
`;

export const SelectorLabel = styled.label<{
  horizontal?: boolean;
  disabled?: boolean;
}>`
  width: ${(p) => (p.horizontal ? "auto" : "100%")};
  margin-${(p) => (p.horizontal ? "right" : "bottom")}: ${theme.spacing(0)}};
  color: ${(p) => (p.disabled ? theme.colors.grey(3) : theme.colors.blackText)};
`;

export const Figure = styled.figure`
  margin: 0 0 0 0;
  width: 100%;
`;

export const Table = styled.table`
  overflow: scroll;
  width: 100%;
  border-spacing: 1px;
`;

export const TH = styled.th<{ active?: boolean }>`
  text-align: left;
  padding: ${theme.spacing(1)} ${theme.spacing(3)};
  ${theme.fontSize(-1)};
  background-color: ${theme.colors.lightBlue};
  color: white;
  ${(p) =>
    p.active
      ? `
    text-decoration: underline;
    cursor: pointer;  
  `
      : ""};

  &:first-child {
    border-top-left-radius: 4px;
  }
  &:last-child {
    border-top-right-radius: 4px;
  }
`;

export const TR = styled.tr`
  &:nth-child(even) {
    background-color: ${theme.colors.grey(4)};
  }
  &:last-child {
    td:first-child {
      border-bottom-left-radius: 4px;
    }
    td:last-child {
      border-bottom-right-radius: 4px;
    }
  }
  ${theme.fontSize(-1)};
`;

export const TD = styled.td`
  text-align: left;
  padding: ${theme.spacing(1)} ${theme.spacing(3)};
  ${theme.fontSize(-1)};
`;

export const ComplianceIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: ${theme.spacing(1)};
`;
