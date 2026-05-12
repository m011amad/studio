import { useMemo } from "react";
import { theme } from "antd";
import { createStyles } from "antd-style";

const useStyles = createStyles(({ css, cssVar }) => {
  const illustrationBorder = {
    border: `${cssVar.lineWidth} solid ${cssVar.colorBorder}`,
  };

  const illustrationBox = {
    ...illustrationBorder,
    boxShadow: `4px 4px 0 ${cssVar.colorBorder}`,
  };

  return {
    illustrationBorder,
    illustrationBox,
    buttonRoot: css({
      ...illustrationBox,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    }),
    modalContainer: css({
      ...illustrationBox,
    }),
    tooltipRoot: css({
      padding: cssVar.padding,
    }),
    popupBox: css({
      ...illustrationBox,
      borderRadius: cssVar.borderRadiusLG,
      backgroundColor: cssVar.colorBgContainer,
    }),
    progressRail: css({
      border: `${cssVar.lineWidth} solid ${cssVar.colorBorder}`,
      boxShadow: `2px 2px 0 ${cssVar.colorBorder}`,
    }),
    progressTrack: css({
      border: "none",
    }),
    inputNumberActions: css({
      width: 12,
    }),
  };
});

const useIllustrationTheme = () => {
  const { styles } = useStyles();

  return useMemo(
    () => ({
      theme: {
        algorithm: theme.defaultAlgorithm,
        token: {
          colorText: "#2A2520",
          colorPrimary: "#C9A96E",
          colorSuccess: "#51CF66",
          colorWarning: "#FFD93D",
          colorError: "#FA5252",
          colorInfo: "#4DABF7",
          colorBorder: "#2A2520",
          colorBorderSecondary: "#2A2520",
          lineWidth: 3,
          lineWidthBold: 3,
          borderRadius: 12,
          borderRadiusLG: 16,
          borderRadiusSM: 8,
          controlHeight: 40,
          controlHeightSM: 34,
          controlHeightLG: 48,
          fontSize: 15,
          fontWeightStrong: 600,
          colorBgBase: "#EDE8DF",
          colorBgContainer: "#F5F0EA",
        },
        components: {
          Button: {
            primaryShadow: "none",
            dangerShadow: "none",
            defaultShadow: "none",
            fontWeight: 600,
          },
          Modal: {
            boxShadow: "none",
          },
          Card: {
            boxShadow: "4px 4px 0 #2A2520",
            colorBgContainer: "#F5F0EA",
          },
          Tooltip: {
            colorBorder: "#2A2520",
            colorBgSpotlight: "rgba(100, 100, 100, 0.95)",
            borderRadius: 8,
          },
          Select: {
            optionSelectedBg: "transparent",
          },
          Slider: {
            dotBorderColor: "#C9A96E",
            dotActiveBorderColor: "#C9A96E",
            colorPrimaryBorder: "#C9A96E",
            colorPrimaryBorderHover: "#C9A96E",
          },
        },
      },
      button: {
        classNames: {
          root: styles.buttonRoot,
        },
      },
      modal: {
        classNames: {
          container: styles.modalContainer,
        },
      },
      alert: {
        className: styles.illustrationBorder,
      },
      colorPicker: {
        arrow: false,
        classNames: {
          root: styles.illustrationBox,
        },
      },
      popover: {
        classNames: {
          container: styles.illustrationBox,
        },
      },
      tooltip: {
        arrow: false,
        classNames: {
          root: styles.tooltipRoot,
          container: styles.illustrationBox,
        },
      },
      dropdown: {
        classNames: {
          root: styles.popupBox,
        },
      },
      select: {
        classNames: {
          root: styles.illustrationBox,
          popup: {
            root: styles.popupBox,
          },
        },
      },
      input: {
        classNames: {
          root: styles.illustrationBox,
        },
      },
      inputNumber: {
        classNames: {
          root: styles.illustrationBox,
          actions: styles.inputNumberActions,
        },
      },
      progress: {
        classNames: {
          rail: styles.progressRail,
          track: styles.progressTrack,
        },
        styles: {
          rail: {
            height: 16,
          },
          track: {
            height: 10,
          },
        },
      },
    }),
    [],
  );
};

export default useIllustrationTheme;
