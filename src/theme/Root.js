const sidepanelOffsetAnchorStyle = {
  position: 'absolute',
  width: '0',
  height: '0',
  overflow: 'hidden',
  opacity: '0',
  pointerEvents: 'none',
};

export default function Root({children}) {
  return (
    <>
      {children}
      <span
        aria-hidden="true"
        id="docsearch-sidepanel-offset-anchor"
        style={sidepanelOffsetAnchorStyle}
      />
    </>
  );
}